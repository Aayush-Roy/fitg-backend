const Progress = require('../models/Progress');

// Add weight progress
const addWeightProgress = async (req, res) => {
  try {
    // Get weight from request body
    const { weight, notes } = req.body;
    
    // Create new progress entry
    const progress = await Progress.create({
      userId: req.userId,
      weight,
      notes,
      date: new Date()
    });
    
    res.status(201).json({
      success: true,
      message: 'Weight progress added successfully',
      data: { progress }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get progress history for logged-in user
const getProgressHistory = async (req, res) => {
  try {
    // Find all progress entries for user, sorted by date (newest first)
    const progressHistory = await Progress.find({
      userId: req.userId
    }).sort({ date: -1 });
    
    res.json({
      success: true,
      message: 'Progress history retrieved successfully',
      data: { progressHistory }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get latest progress for logged-in user
const getLatestProgress = async (req, res) => {
  try {
    // Find latest progress entry for user
    const latestProgress = await Progress.findOne({
      userId: req.userId
    }).sort({ date: -1 });
    
    res.json({
      success: true,
      message: 'Latest progress retrieved successfully',
      data: { latestProgress }
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
  addWeightProgress,
  getProgressHistory,
  getLatestProgress
};