const mongoose = require('mongoose');

// Simple Diet Plan Schema
const dietPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  calories: {
    type: Number,
    required: true
  },
  meals: [
    {
      name: {
        type: String,
        required: true
      },
      time: {
        type: String,
        required: true
      },
      foods: [String]
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const DietPlan = mongoose.model('DietPlan', dietPlanSchema);

module.exports = DietPlan;