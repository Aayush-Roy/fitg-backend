const Membership = require('../models/Membership');

// Get current membership for logged-in user
const getCurrentMembership = async (req, res) => {
  try {
    // Find active membership for user
    const membership = await Membership.findOne({
      userId: req.userId,
      isActive: true
    });
    
    // Check if user has active membership
    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'No active membership found'
      });
    }
    
    res.json({
      success: true,
      message: 'Membership retrieved successfully',
      data: { membership }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create membership (for admin or after payment)
const createMembership = async (req, res) => {
  try {
    const { userId, planType, endDate } = req.body;
    
    // Deactivate any existing active membership for user
    await Membership.findOneAndUpdate(
      { userId, isActive: true },
      { isActive: false }
    );
    
    // Create new membership
    const membership = await Membership.create({
      userId,
      planType,
      endDate,
      isActive: true
    });
    
    res.status(201).json({
      success: true,
      message: 'Membership created successfully',
      data: { membership }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Check if user's membership is valid
const checkMembershipValidity = async (req, res) => {
  try {
    // Find active membership for user
    const membership = await Membership.findOne({
      userId: req.userId,
      isActive: true
    });
    
    // Check if membership exists and is not expired
    let isValid = false;
    if (membership && membership.endDate > new Date()) {
      isValid = true;
    } else if (membership && membership.endDate <= new Date()) {
      // Auto-deactivate expired membership
      membership.isActive = false;
      await membership.save();
    }
    
    res.json({
      success: true,
      message: 'Membership validity checked',
      data: { isValid, membership }
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
  getCurrentMembership,
  createMembership,
  checkMembershipValidity
};