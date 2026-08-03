const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
} = require("../controllers/goalController");

// Create Goal
router.post("/", protect, createGoal);

// Get All Goals
router.get("/", protect, getGoals);

// Get Goal By ID
router.get("/:id", protect, getGoalById);

// Update Goal
router.put("/:id", protect, updateGoal);

// Delete Goal
router.delete("/:id", protect, deleteGoal);

module.exports = router;