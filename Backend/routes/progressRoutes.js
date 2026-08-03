const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addProgress,
  getProgress,
  getProgressById,
  updateProgress,
  deleteProgress,
} = require("../controllers/progressController");

// Add Progress
router.post("/", protect, addProgress);

// Get All Progress
router.get("/", protect, getProgress);

// Get Progress By ID
router.get("/:id", protect, getProgressById);

// Update Progress
router.put("/:id", protect, updateProgress);

// Delete Progress
router.delete("/:id", protect, deleteProgress);

module.exports = router;