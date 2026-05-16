const express = require('express');
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const twilioService = require('../services/twilioService');

const router = express.Router();

// Validation middleware
const validateApplication = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('phoneNumber')
    .trim()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please enter a valid phone number'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  body('city')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City/Location must be between 2 and 100 characters'),
  body('interest')
    .isIn(['Volunteer', 'Event Participation', 'Feedback'])
    .withMessage('Please select a valid interest type'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
];

// POST /api/applications/submit-application
router.post('/submit-application', validateApplication, async (req, res) => {
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

    // Create new application
    const application = new Application({
      fullName: req.body.fullName,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      city: req.body.city,
      interest: req.body.interest,
      message: req.body.message
    });

    // Save to database
    const savedApplication = await application.save();

    // Send SMS notification to admin (async, don't wait for response)
    twilioService.notifyAdminApplication(savedApplication)
      .then(result => {
        if (result.success) {
          console.log('Admin notification sent successfully');
        } else {
          console.error('Failed to send admin notification:', result.error);
        }
      })
      .catch(err => {
        console.error('SMS notification error:', err);
      });

    // Send confirmation SMS to user (async)
    twilioService.sendConfirmationSMS(
      req.body.phoneNumber,
      'application',
      savedApplication._id
    ).catch(err => {
      console.error('Confirmation SMS error:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: {
        id: savedApplication._id,
        referenceId: savedApplication._id.toString().slice(-8).toUpperCase(),
        submittedAt: savedApplication.submittedAt
      }
    });

  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/applications (Admin endpoint - for future admin dashboard)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, interest } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (interest) filter.interest = interest;

    const applications = await Application.find(filter)
      .sort({ submittedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Application.countDocuments(filter);

    res.json({
      success: true,
      data: applications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    });
  }
});

// GET /api/applications/:id (Admin endpoint)
router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: application
    });

  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application'
    });
  }
});

module.exports = router; 