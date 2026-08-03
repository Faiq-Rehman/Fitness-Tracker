const Notification = require("../models/Notification");

// ==============================
// Create Notification
// ==============================

const createNotification = async (req, res) => {
  try {

    const {
      title,
      message,
      type,
      isRead
    } = req.body;

    const notification = await Notification.create({
      userId: req.user._id,
      title,
      message,
      type,
      isRead
    });

    res.status(201).json({
      success: true,
      message: "Notification Created Successfully",
      notification,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Get All Notifications
// ==============================

const getNotifications = async (req, res) => {
  try {

    const notifications = await Notification.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: notifications.length,
      notifications,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Get Notification By ID
// ==============================

const getNotificationById = async (req, res) => {
  try {

    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification Not Found",
      });
    }

    res.status(200).json({
      success: true,
      notification,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Mark Notification As Read
// ==============================

const markAsRead = async (req, res) => {
  try {

    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification Not Found",
      });
    }

    notification.isRead = true;

    const updatedNotification = await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification Marked As Read",
      notification: updatedNotification,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Delete Notification
// ==============================

const deleteNotification = async (req, res) => {
  try {

    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification Not Found",
      });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Notification Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  createNotification,
  getNotifications,
  getNotificationById,
  markAsRead,
  deleteNotification,
};