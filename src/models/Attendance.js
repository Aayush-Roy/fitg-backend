const mongoose = require('mongoose');

// Simple Attendance Schema
const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  checkInTime: {
    type: Date,
    default: Date.now
  },
  date: {
    type: Date,
    default: () => new Date().setHours(0, 0, 0, 0) // Start of day
  }
}, {
  timestamps: true
});

// Prevent multiple check-ins per day for same user
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;