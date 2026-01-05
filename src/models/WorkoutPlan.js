const mongoose = require('mongoose');

// Simple Workout Plan Schema
const workoutPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  exercises: [
    {
      name: {
        type: String,
        required: true
      },
      sets: {
        type: Number,
        required: true,
        min: 1
      },
      reps: {
        type: Number,
        required: true,
        min: 1
      },
      restTime: {
        type: Number, // in seconds
        default: 60
      }
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

const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);

module.exports = WorkoutPlan;