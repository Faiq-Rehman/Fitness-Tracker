const Setting = require("../models/Setting");

// ==============================
// Create Settings
// ==============================

const createSettings = async (req, res) => {
  try {

    const {
      theme,
      language,
      notifications,
      darkMode,
    } = req.body;

    // Check if settings already exist
    const existingSetting = await Setting.findOne({
      userId: req.user._id,
    });

    if (existingSetting) {
      return res.status(400).json({
        success: false,
        message: "Settings Already Exist",
      });
    }

    const setting = await Setting.create({
      userId: req.user._id,
      theme,
      language,
      notifications,
      darkMode,
    });

    res.status(201).json({
      success: true,
      message: "Settings Created Successfully",
      setting,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Get Settings
// ==============================

const getSettings = async (req, res) => {
  try {

    const setting = await Setting.findOne({
      userId: req.user._id,
    });

    if (!setting) {

      return res.status(404).json({
        success: false,
        message: "Settings Not Found",
      });

    }

    res.status(200).json({
      success: true,
      setting,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Update Settings
// ==============================

const updateSettings = async (req, res) => {
  try {

    const setting = await Setting.findOne({
      userId: req.user._id,
    });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "Settings Not Found",
      });
    }

    setting.theme = req.body.theme || setting.theme;
    setting.language = req.body.language || setting.language;

    if (req.body.measurementUnit !== undefined) {
      setting.measurementUnit = req.body.measurementUnit;
    }

    if (req.body.notifications !== undefined) {
      setting.notifications = req.body.notifications;
    }

    const updatedSetting = await setting.save();

    res.status(200).json({
      success: true,
      message: "Settings Updated Successfully",
      setting: updatedSetting,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// ==============================
// Delete Settings
// ==============================

const deleteSettings = async (req, res) => {
  try {

    const setting = await Setting.findOne({
      userId: req.user._id,
    });

    if (!setting) {

      return res.status(404).json({
        success: false,
        message: "Settings Not Found",
      });

    }

    await Setting.findByIdAndDelete(setting._id);

    res.status(200).json({
      success: true,
      message: "Settings Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  createSettings,
  getSettings,
  updateSettings,
  deleteSettings,
};