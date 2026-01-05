const DietPlan = require('../models/DietPlan');

// Create diet plan (admin only)
const createDietPlan = async (req, res) => {
  try {
    // Get diet plan data from request
    const { name, description, calories, meals } = req.body;
    
    // Create new diet plan
    const dietPlan = await DietPlan.create({
      name,
      description,
      calories,
      meals,
      createdBy: req.userId
    });
    
    res.status(201).json({
      success: true,
      message: 'Diet plan created successfully',
      data: { dietPlan }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all diet plans
const getAllDietPlans = async (req, res) => {
  try {
    // Get all diet plans
    const dietPlans = await DietPlan.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      message: 'Diet plans retrieved successfully',
      data: { dietPlans }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get diet plan by ID
const getDietPlanById = async (req, res) => {
  try {
    // Get diet plan ID from URL params
    const { id } = req.params;
    
    // Find diet plan by ID
    const dietPlan = await DietPlan.findById(id)
      .populate('createdBy', 'name email');
    
    // Check if diet plan exists
    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Diet plan retrieved successfully',
      data: { dietPlan }
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
  createDietPlan,
  getAllDietPlans,
  getDietPlanById
};