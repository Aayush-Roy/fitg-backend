const jwt = require('jsonwebtoken');

// Simple function to generate JWT token
const generateToken = (userId) => {
  // Create token with user ID, expires in 7 days
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

module.exports = generateToken;