const WorkoutPlan = require('../models/WorkoutPlan');
const UserWorkout = require('../models/UserWorkout');

// Create workout plan (admin only)
const createWorkoutPlan = async (req, res) => {
  try {
    // Get workout data from request
    const { name, description, difficulty, exercises } = req.body;
    
    // Create new workout plan
    const workoutPlan = await WorkoutPlan.create({
      name,
      description,
      difficulty,
      exercises,
      createdBy: req.userId // User ID from auth middleware
    });
    
    res.status(201).json({
      success: true,
      message: 'Workout plan created successfully',
      data: { workoutPlan }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all workout plans
const getAllWorkoutPlans = async (req, res) => {
  try {
    // Get all workout plans
    const workoutPlans = await WorkoutPlan.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 }); // Newest first
    
    res.json({
      success: true,
      message: 'Workout plans retrieved successfully',
      data: { workoutPlans }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get single workout plan by ID
const getWorkoutPlanById = async (req, res) => {
  try {
    // Get workout plan ID from URL params
    const { id } = req.params;
    
    // Find workout plan by ID
    const workoutPlan = await WorkoutPlan.findById(id)
      .populate('createdBy', 'name email');
    
    // Check if workout plan exists
    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Workout plan retrieved successfully',
      data: { workoutPlan }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Assign workout plan to logged-in user
const assignWorkoutPlan = async (req, res) => {
  try {
    // Get workout plan ID from request body
    const { workoutPlanId } = req.body;
    
    // Check if workout plan exists
    const workoutPlan = await WorkoutPlan.findById(workoutPlanId);
    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found'
      });
    }
    
    // Deactivate any existing active workout for user
    await UserWorkout.findOneAndUpdate(
      { userId: req.userId, isActive: true },
      { isActive: false }
    );
    
    // Assign new workout plan to user
    const userWorkout = await UserWorkout.create({
      userId: req.userId,
      workoutPlanId,
      isActive: true
    });
    
    res.status(201).json({
      success: true,
      message: 'Workout plan assigned successfully',
      data: { userWorkout }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get active workout plan for logged-in user
const getActiveWorkoutPlan = async (req, res) => {
  try {
    // Find active workout plan for user
    const userWorkout = await UserWorkout.findOne({
      userId: req.userId,
      isActive: true
    }).populate({
      path: 'workoutPlanId',
      populate: {
        path: 'createdBy',
        select: 'name email'
      }
    });
    
    // Check if user has an active workout plan
    if (!userWorkout) {
      return res.status(404).json({
        success: false,
        message: 'No active workout plan found'
      });
    }
    
    res.json({
      success: true,
      message: 'Active workout plan retrieved successfully',
      data: { userWorkout }
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
  createWorkoutPlan,
  getAllWorkoutPlans,
  getWorkoutPlanById,
  assignWorkoutPlan,
  getActiveWorkoutPlan
};