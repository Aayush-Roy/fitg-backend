const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const {
  addWeightProgress,
  getProgressHistory,
  getLatestProgress
} = require('../controllers/progress.controller');

// All routes require authentication
router.post('/weight', authMiddleware, addWeightProgress);
router.get('/history', authMiddleware, getProgressHistory);
router.get('/latest', authMiddleware, getLatestProgress);

module.exports = router;