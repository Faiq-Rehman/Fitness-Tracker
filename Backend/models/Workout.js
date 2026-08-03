const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    exerciseName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["Strength", "Cardio", "Flexibility", "Other"],
      required: true,
    },

    sets: {
      type: Number,
      default: 0,
    },

    reps: {
      type: Number,
      default: 0,
    },

    weight: {
      type: Number,
      default: 0,
    },

    notes: {
      type: String,
      default: "",
    },

    duration: {
      type: String,
      default: "",
    },

    workoutDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Workout", workoutSchema);