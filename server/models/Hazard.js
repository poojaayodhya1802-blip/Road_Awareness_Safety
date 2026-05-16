const mongoose = require('mongoose');

const hazardSchema = new mongoose.Schema({
  reporterName: {
    type: String,
    required: [true, 'Reporter name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  hazardType: {
    type: String,
    required: [true, 'Hazard type is required'],
    enum: ['Pothole', 'Broken Signal', 'Accident', 'Obstruction', 'Others'],
    default: 'Others'
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Location address is required'],
      trim: true,
      maxlength: [200, 'Address cannot exceed 200 characters']
    },
    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180
      }
    }
  },
  photoUrl: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['reported', 'under_review', 'resolved', 'closed'],
    default: 'reported'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  reportedAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date
  }
});

// Index for better query performance
hazardSchema.index({ reportedAt: -1 });
hazardSchema.index({ status: 1 });
hazardSchema.index({ hazardType: 1 });
hazardSchema.index({ 'location.coordinates': '2dsphere' });

// Method to calculate priority based on hazard type
hazardSchema.methods.calculatePriority = function() {
  const priorityMap = {
    'Accident': 'critical',
    'Broken Signal': 'high',
    'Pothole': 'medium',
    'Obstruction': 'medium',
    'Others': 'low'
  };
  this.priority = priorityMap[this.hazardType] || 'medium';
  return this.priority;
};

// Pre-save middleware to calculate priority
hazardSchema.pre('save', function(next) {
  if (this.isModified('hazardType')) {
    this.calculatePriority();
  }
  next();
});

module.exports = mongoose.model('Hazard', hazardSchema); 