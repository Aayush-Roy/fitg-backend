const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile,registerAdmin } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

// Public routes
router.post('/register', register);
// Admin registration (secret route)
router.post('/admin/register', registerAdmin);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;