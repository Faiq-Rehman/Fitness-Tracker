const express = require("express");
const router = express.Router();

const adminProtect = require("../middleware/adminAuthMiddleware");

const {
  getOverview,
  getAllUsers,
  createUser,
  updateUserStatus,
  getAllWorkouts,
  getAllNutrition,
  getAllProgress,
  getAllNotifications,
  getAllReports,
  getAllSupportTickets,
  updateSupportTicketStatus,
} = require("../controllers/adminDataController");

// Admin overview
router.get("/overview", adminProtect, getOverview);

// Admin lists
router.get("/users", adminProtect, getAllUsers);
router.post("/users", adminProtect, createUser);
router.put("/users/:id", adminProtect, updateUserStatus);
router.get("/workouts", adminProtect, getAllWorkouts);
router.get("/nutrition", adminProtect, getAllNutrition);
router.get("/progress", adminProtect, getAllProgress);
router.get("/notifications", adminProtect, getAllNotifications);
router.get("/reports", adminProtect, getAllReports);
router.get("/tickets", adminProtect, getAllSupportTickets);
router.put("/tickets/:id", adminProtect, updateSupportTicketStatus);

module.exports = router;
