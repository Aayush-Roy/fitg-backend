const Attendance = require('../models/Attendance');

// Check-in for attendance
const checkIn = async (req, res) => {
  try {
    // Get current date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if user already checked in today
    const existingAttendance = await Attendance.findOne({
      userId: req.userId,
      date: today
    });
    
    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'You have already checked in today'
      });
    }
    
    // Create new attendance record
    const attendance = await Attendance.create({
      userId: req.userId,
      date: today,
      checkInTime: new Date()
    });
    
    res.status(201).json({
      success: true,
      message: 'Checked in successfully',
      data: { attendance }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get attendance history for logged-in user
const getAttendanceHistory = async (req, res) => {
  try {
    // Get query parameters for filtering
    const { month, year } = req.query;
    
    // Build filter
    const filter = { userId: req.userId };
    
    // Filter by month and year if provided
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      filter.date = { $gte: startDate, $lte: endDate };
    }
    
    // Get attendance records, sorted by date (newest first)
    const attendanceHistory = await Attendance.find(filter)
      .sort({ date: -1 });
    
    res.json({
      success: true,
      message: 'Attendance history retrieved successfully',
      data: { attendanceHistory }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get today's attendance for logged-in user
const getTodaysAttendance = async (req, res) => {
  try {
    // Get current date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find today's attendance
    const attendance = await Attendance.findOne({
      userId: req.userId,
      date: today
    });
    
    res.json({
      success: true,
      message: "Today's attendance retrieved successfully",
      data: { attendance }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  checkIn,
  getAttendanceHistory,
  getTodaysAttendance
};