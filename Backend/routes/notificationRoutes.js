const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createNotification,
  getNotifications,
  getNotificationById,
  markAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

// Create Notification
router.post("/", protect, createNotification);

// Get All Notifications
router.get("/", protect, getNotifications);

// Get Notification By ID
router.get("/:id", protect, getNotificationById);

// Mark Notification As Read
router.put("/:id/read", protect, markAsRead);

// Delete Notification
router.delete("/:id", protect, deleteNotification);

module.exports = router;