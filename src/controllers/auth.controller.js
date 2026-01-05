const User = require('../models/User');
const generateToken = require('../utils/generateToken');


// Admin register (secret endpoint)
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, secretKey } = req.body;
    
    // Secret key check (simple protection)
    if (secretKey !== 'ADMIN_SECRET_123') {
      return res.status(403).json({
        success: false,
        message: 'Invalid admin secret key'
      });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists'
      });
    }
    
    // Create admin user
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
      age: 30,
      height: 175,
      weight: 70,
      goal: 'maintain'
    });
    
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isAdmin: true
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Register new user
const register = async (req, res) => {
  try {
    // Get user data from request body
    const { name, email, password, age, height, weight, goal } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password, // Password will be hashed by pre-save middleware
      age,
      height,
      weight,
      goal
    });
    
    // Generate token
    const token = generateToken(user._id);
    
    // Send response (don't send password)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          age: user.age,
          height: user.height,
          weight: user.weight,
          goal: user.goal
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Login user
// const login = async (req, res) => {
//   try {
//     // Get email and password from request
//     const { email, password } = req.body;
    
//     // Find user by email
//     const user = await User.findOne({ email });
    
//     // Check if user exists
//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }
    
//     // Check if password matches
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }
    
//     // Generate token
//     const token = generateToken(user._id);
    
//     // Send response
//     res.json({
//       success: true,
//       message: 'Login successful',
//       data: {
//         token,
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           age: user.age,
//           height: user.height,
//           weight: user.weight,
//           goal: user.goal
//         }
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };
// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    console.log(user);
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    const token = generateToken(user._id);
    
    // ✅ ADDED: Return isAdmin flag
    res.json({
      success: true,
      message: user.role === 'admin' ? 'Admin login successful' : 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isAdmin: user.role === 'admin', // ✅ This helps frontend
          age: user.age,
          height: user.height,
          weight: user.weight,
          goal: user.goal
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
// Get current user profile
const getProfile = async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    const user = await User.findById(req.userId).select('-password');
    
    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    // Get update data from request body
    const { name, age, height, weight, goal } = req.body;
    
    // Find and update user
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, age, height, weight, goal },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = { register, login, getProfile, updateProfile, registerAdmin };