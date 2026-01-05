const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const {
  createOrder,
  verifyPayment,
  getPaymentHistory
} = require('../controllers/payment.controller');

// All routes require authentication
router.post('/create-order', authMiddleware, createOrder);
router.post('/verify', authMiddleware, verifyPayment);
router.get('/history', authMiddleware, getPaymentHistory);

module.exports = router;