const User = require("../models/User");
const Workout = require("../models/Workout");
const Nutrition = require("../models/Nutrition");
const Progress = require("../models/Progress");
const Notification = require("../models/Notification");
const Report = require("../models/Report");
const SupportTicket = require("../models/SupportTicket");

// ==============================
// Admin - Get Overview Counts
// ==============================

const getOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalWorkouts = await Workout.countDocuments();
    const totalNutrition = await Nutrition.countDocuments();
    const totalProgress = await Progress.countDocuments();
    const totalNotifications = await Notification.countDocuments();
    const totalReports = await Report.countDocuments();

    res.status(200).json({
      success: true,
      overview: {
        totalUsers,
        totalWorkouts,
        totalNutrition,
        totalProgress,
        totalNotifications,
        totalReports,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// Admin - Get All Users
// ==============================

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, total: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// Admin - Create User
// ==============================

const createUser = async (req, res) => {
  try {
    const { fullName, username, email, password, plan, status, age, gender, height, weight } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, username, email and password are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or username already exists",
      });
    }

    const user = await User.create({
      fullName,
      username,
      email,
      password,
      age,
      gender,
      height,
      weight,
      plan: plan || "Free",
      status: status || "Active",
    });

    res.status(201).json({ success: true, message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// Admin - Update User Status
// ==============================

const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (status) {
      user.status = status;
    }

    const updatedUser = await user.save();
    res.status(200).json({ success: true, message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// Admin - Get All Workouts
// ==============================

const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find()
      .populate('userId', 'fullName username email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, total: workouts.length, workouts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// Admin - Get All Nutrition
// ==============================

const getAllNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.find()
      .populate('userId', 'fullName username email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, total: nutrition.length, nutrition });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// Admin - Get All Progress
// ==============================

const getAllProgress = async (req, res) => {
  try {
    const progress = await Progress.find()
      .populate('userId', 'fullName username email')
      .sort({ progressDate: -1 });
    res.status(200).json({ success: true, total: progress.length, progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// Admin - Get All Notifications
// ==============================

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, total: notifications.length, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// Admin - Get All Reports
// ==============================

const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('userId', 'fullName username email name')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, total: reports.length, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// Admin - Get All Support Tickets
// ==============================

const getAllSupportTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find()
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, total: tickets.length, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// Admin - Update Support Ticket Status
// ==============================

const updateSupportTicketStatus = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    ticket.status = req.body.status || ticket.status;
    ticket.priority = req.body.priority || ticket.priority;

    const updatedTicket = await ticket.save();
    res.status(200).json({ success: true, message: "Ticket updated successfully", ticket: updatedTicket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
