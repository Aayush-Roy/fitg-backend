const razorpay = require('../config/razorpay');
const Payment = require('../models/Payment');
const Membership = require('../models/Membership');

// Simple payment plans configuration (in paise)
const PLANS = {
  monthly: 50000, // 500 INR
  quarterly: 135000, // 1350 INR (10% discount)
  yearly: 480000 // 4800 INR (20% discount)
};

// Create Razorpay order
const createOrder = async (req, res) => {
  try {
    const { planType } = req.body;
    
    // Validate plan type
    if (!PLANS[planType]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan type'
      });
    }
    
    // Get amount for selected plan
    const amount = PLANS[planType];
    
    // Create options for Razorpay order
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.userId.toString(),
        planType: planType
      }
    };
    
    // Create order in Razorpay
    const order = await razorpay.orders.create(options);
    
    // Save payment record in database
    const payment = await Payment.create({
      userId: req.userId,
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: 'created',
      planType: planType
    });
    
    // Send order details to frontend
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Verify payment
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // Verify payment signature (IMPORTANT: This is a simplified verification)
    // In production, use crypto library for proper verification
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');
    
    // Check if signature matches
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }
    
    // Find payment record
    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
      userId: req.userId
    });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }
    
    // Update payment status
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.status = 'paid';
    await payment.save();
    
    // Calculate membership end date based on plan type
    const endDate = new Date();
    if (payment.planType === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (payment.planType === 'quarterly') {
      endDate.setMonth(endDate.getMonth() + 3);
    } else if (payment.planType === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    
    // Deactivate any existing membership
    await Membership.findOneAndUpdate(
      { userId: req.userId, isActive: true },
      { isActive: false }
    );
    
    // Create new membership
    const membership = await Membership.create({
      userId: req.userId,
      planType: payment.planType,
      endDate: endDate,
      isActive: true
    });
    
    res.json({
      success: true,
      message: 'Payment verified and membership activated successfully',
      data: { payment, membership }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

// Get payment history for logged-in user
const getPaymentHistory = async (req, res) => {
  try {
    // Get all payments for user
    const payments = await Payment.find({
      userId: req.userId
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      message: 'Payment history retrieved successfully',
      data: { payments }
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
  createOrder,
  verifyPayment,
  getPaymentHistory
};