const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');
const {
  createDietPlan,
  getAllDietPlans,
  getDietPlanById
} = require('../controllers/diet.controller');

// Admin only routes
router.post('/plans', authMiddleware, adminMiddleware, createDietPlan);

// Public routes (for viewing plans)
router.get('/plans', getAllDietPlans);
router.get('/plans/:id', getDietPlanById);

module.exports = router;