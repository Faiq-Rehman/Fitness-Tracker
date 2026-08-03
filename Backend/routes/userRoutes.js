const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteUser,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

// ==============================
// Public Routes
// ==============================

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

// ==============================
// Protected Routes
// ==============================

// Get User Profile
router.get("/profile", protect, getUserProfile);

// Update User Profile
router.put("/profile", protect, updateUserProfile);

// Change Password
router.put("/change-password", protect, changePassword);

// Delete User
router.delete("/delete", protect, deleteUser);

module.exports = router;