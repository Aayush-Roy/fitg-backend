const mongoose = require('mongoose');

// Tracks which workout plan is assigned to which user
const userWorkoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workoutPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkoutPlan',
    required: true
  },
  assignedDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure one active workout per user
userWorkoutSchema.index({ userId: 1, isActive: 1 }, { unique: true });

const UserWorkout = mongoose.model('UserWorkout', userWorkoutSchema);

module.exports = UserWorkout;