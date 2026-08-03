const Progress = require("../models/Progress");

// ==============================
// Add Progress
// ==============================

const addProgress = async (req, res) => {
  try {

    const {
      weight,
      chest,
      waist,
      biceps,
      runTime,
      liftingWeight,
      progressDate,
      date,
      lift,
      notes,
    } = req.body;

    const progress = await Progress.create({
      userId: req.user._id,
      weight: Number(weight) || 0,
      chest: Number(chest) || 0,
      waist: Number(waist) || 0,
      biceps: Number(biceps) || 0,
      runTime: Number(runTime) || 0,
      liftingWeight: Number(liftingWeight) || Number(lift) || 0,
      notes: notes || "",
      progressDate: progressDate || date || new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Progress Added Successfully",
      progress,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Get All Progress
// ==============================

const getProgress = async (req, res) => {
  try {

    const progress = await Progress.find({
      userId: req.user._id,
    }).sort({ progressDate: -1 });

    res.status(200).json({
      success: true,
      total: progress.length,
      progress,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Get Progress By ID
// ==============================

const getProgressById = async (req, res) => {
  try {

    const progress = await Progress.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!progress) {

      return res.status(404).json({
        success: false,
        message: "Progress Record Not Found",
      });

    }

    res.status(200).json({
      success: true,
      progress,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Update Progress
// ==============================

const updateProgress = async (req, res) => {
  try {

    const progress = await Progress.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!progress) {

      return res.status(404).json({
        success: false,
        message: "Progress Record Not Found",
      });

    }

    progress.weight = Number(req.body.weight) || progress.weight;
    progress.chest = Number(req.body.chest) || progress.chest;
    progress.waist = Number(req.body.waist) || progress.waist;
    progress.biceps = Number(req.body.biceps) || progress.biceps;
    progress.runTime = Number(req.body.runTime) || progress.runTime;
    progress.liftingWeight = Number(req.body.liftingWeight) || Number(req.body.lift) || progress.liftingWeight;
    progress.notes = req.body.notes || progress.notes;
    progress.progressDate = req.body.progressDate || req.body.date || progress.progressDate;

    const updatedProgress = await progress.save();

    res.status(200).json({
      success: true,
      message: "Progress Updated Successfully",
      progress: updatedProgress,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Delete Progress
// ==============================

const deleteProgress = async (req, res) => {
  try {

    const progress = await Progress.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!progress) {

      return res.status(404).json({
        success: false,
        message: "Progress Record Not Found",
      });

    }

    await Progress.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Progress Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  addProgress,
  getProgress,
  getProgressById,
  updateProgress,
  deleteProgress,
};