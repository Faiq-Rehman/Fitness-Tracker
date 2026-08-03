const Goal = require("../models/Goal");

// ==============================
// Create Goal
// ==============================

const createGoal = async (req, res) => {
  try {

    const {
      goalType,
      target,
      currentValue,
      deadline,
      status,
    } = req.body;

    const goal = await Goal.create({
      userId: req.user._id,
      goalType,
      target,
      currentValue,
      deadline,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Goal Created Successfully",
      goal,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Get All Goals
// ==============================

const getGoals = async (req, res) => {
  try {

    const goals = await Goal.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: goals.length,
      goals,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Get Goal By ID
// ==============================

const getGoalById = async (req, res) => {
  try {

    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!goal) {

      return res.status(404).json({
        success: false,
        message: "Goal Not Found",
      });

    }

    res.status(200).json({
      success: true,
      goal,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Update Goal
// ==============================

const updateGoal = async (req, res) => {
  try {

    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!goal) {

      return res.status(404).json({
        success: false,
        message: "Goal Not Found",
      });

    }

    goal.goalType = req.body.goalType || goal.goalType;
    goal.target = req.body.target || goal.target;
    goal.currentValue =
      req.body.currentValue || goal.currentValue;
    goal.deadline = req.body.deadline || goal.deadline;
    goal.status = req.body.status || goal.status;

    const updatedGoal = await goal.save();

    res.status(200).json({
      success: true,
      message: "Goal Updated Successfully",
      goal: updatedGoal,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Delete Goal
// ==============================

const deleteGoal = async (req, res) => {
  try {

    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!goal) {

      return res.status(404).json({
        success: false,
        message: "Goal Not Found",
      });

    }

    await Goal.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Goal Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
};