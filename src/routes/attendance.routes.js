const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const {
  checkIn,
  getAttendanceHistory,
  getTodaysAttendance
} = require('../controllers/attendance.controller');

// All routes require authentication
router.post('/check-in', authMiddleware, checkIn);
router.get('/history', authMiddleware, getAttendanceHistory);
router.get('/today', authMiddleware, getTodaysAttendance);

module.exports = router;