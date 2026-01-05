const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');
const {
  createWorkoutPlan,
  getAllWorkoutPlans,
  getWorkoutPlanById,
  assignWorkoutPlan,
  getActiveWorkoutPlan
} = require('../controllers/workout.controller');

// Admin only routes
router.post('/plans', authMiddleware, adminMiddleware, createWorkoutPlan);

// Public routes (for viewing plans)
router.get('/plans', getAllWorkoutPlans);
router.get('/plans/:id', getWorkoutPlanById);

// User routes (require authentication)
router.post('/assign', authMiddleware, assignWorkoutPlan);
router.get('/active', authMiddleware, getActiveWorkoutPlan);

module.exports = router;