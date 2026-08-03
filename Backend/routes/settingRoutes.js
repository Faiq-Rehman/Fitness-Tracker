const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createSettings,
  getSettings,
  updateSettings,
  deleteSettings,
} = require("../controllers/settingController");

// Create Settings
router.post("/", protect, createSettings);

// Get Settings
router.get("/", protect, getSettings);

// Update Settings
router.put("/", protect, updateSettings);

// Delete Settings
router.delete("/", protect, deleteSettings);

module.exports = router;