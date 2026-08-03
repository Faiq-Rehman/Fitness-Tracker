const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
} = require("../controllers/workoutController");

// Add Workout
router.post("/", protect, addWorkout);

// Get All Workouts
router.get("/", protect, getWorkouts);

// Get Single Workout
router.get("/:id", protect, getWorkoutById);

// Update Workout
router.put("/:id", protect, updateWorkout);

// Delete Workout
router.delete("/:id", protect, deleteWorkout);

module.exports = router;