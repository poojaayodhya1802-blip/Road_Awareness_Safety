const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Hazard = require('../models/Hazard');
const twilioService = require('../services/twilioService');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'hazard-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Validation middleware
const validateHazard = [
  body('reporterName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Reporter name must be between 2 and 100 characters'),
  body('phoneNumber')
    .trim()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please enter a valid phone number'),
  body('hazardType')
    .isIn(['Pothole', 'Broken Signal', 'Accident', 'Obstruction', 'Others'])
    .withMessage('Please select a valid hazard type'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('location.address')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Location address must be between 5 and 200 characters')
];

// POST /api/hazards/report-hazard
router.post('/report-hazard', upload.single('photo'), validateHazard, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }

    // Prepare location data
    const locationData = {
      address: req.body.location.address,
      coordinates: {}
    };

    // Add coordinates if provided
    if (req.body.location.coordinates) {
      const coords = req.body.location.coordinates;
      if (coords.latitude && coords.longitude) {
        locationData.coordinates = {
          latitude: parseFloat(coords.latitude),
          longitude: parseFloat(coords.longitude)
        };
      }
    }

    // Create new hazard report
    const hazard = new Hazard({
      reporterName: req.body.reporterName,
      phoneNumber: req.body.phoneNumber,
      hazardType: req.body.hazardType,
      description: req.body.description,
      location: locationData,
      photoUrl: req.file ? `/uploads/${req.file.filename}` : null
    });

    // Save to database
    const savedHazard = await hazard.save();

    // Send SMS notification to admin (async, don't wait for response)
    twilioService.notifyAdminHazard(savedHazard)
      .then(result => {
        if (result.success) {
          console.log('Admin hazard notification sent successfully');
        } else {
          console.error('Failed to send admin hazard notification:', result.error);
        }
      })
      .catch(err => {
        console.error('SMS notification error:', err);
      });

    // Send confirmation SMS to user (async)
    twilioService.sendConfirmationSMS(
      req.body.phoneNumber,
      'hazard',
      savedHazard._id
    ).catch(err => {
      console.error('Confirmation SMS error:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Hazard report submitted successfully!',
      data: {
        id: savedHazard._id,
        referenceId: savedHazard._id.toString().slice(-8).toUpperCase(),
        reportedAt: savedHazard.reportedAt,
        priority: savedHazard.priority
      }
    });

  } catch (error) {
    console.error('Hazard submission error:', error);
    
    // Clean up uploaded file if database save failed
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Failed to delete uploaded file:', err);
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to submit hazard report. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/hazards (Admin endpoint - for future admin dashboard)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, hazardType, priority } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (hazardType) filter.hazardType = hazardType;
    if (priority) filter.priority = priority;

    const hazards = await Hazard.find(filter)
      .sort({ reportedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Hazard.countDocuments(filter);

    res.json({
      success: true,
      data: hazards,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get hazards error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hazards'
    });
  }
});

// GET /api/hazards/:id (Admin endpoint)
router.get('/:id', async (req, res) => {
  try {
    const hazard = await Hazard.findById(req.params.id);
    
    if (!hazard) {
      return res.status(404).json({
        success: false,
        message: 'Hazard report not found'
      });
    }

    res.json({
      success: true,
      data: hazard
    });

  } catch (error) {
    console.error('Get hazard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hazard report'
    });
  }
});

// Serve uploaded files
router.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.params.filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

module.exports = router; 