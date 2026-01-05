const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');
const {
  getCurrentMembership,
  createMembership,
  checkMembershipValidity
} = require('../controllers/membership.controller');

// User routes
router.get('/current', authMiddleware, getCurrentMembership);
router.get('/check', authMiddleware, checkMembershipValidity);

// Admin only routes
router.post('/', authMiddleware, adminMiddleware, createMembership);

module.exports = router;