const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  city: {
    type: String,
    required: [true, 'City/Location is required'],
    trim: true,
    maxlength: [100, 'City name cannot exceed 100 characters']
  },
  interest: {
    type: String,
    required: [true, 'Interest type is required'],
    enum: ['Volunteer', 'Event Participation', 'Feedback'],
    default: 'Volunteer'
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
applicationSchema.index({ submittedAt: -1 });
applicationSchema.index({ status: 1 });

module.exports = mongoose.model('Application', applicationSchema); 