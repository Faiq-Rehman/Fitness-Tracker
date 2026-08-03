const Workout = require("../models/Workout");

// ==============================
// Add Workout
// ==============================

const addWorkout = async (req, res) => {
  try {
    const {
      exerciseName,
      category,
      sets,
      reps,
      weight,
      notes,
      workoutDate,
      date,
      duration,
      name,
    } = req.body;

    const workout = await Workout.create({
      userId: req.user._id,
      exerciseName: exerciseName || name || "Workout",
      category: category || "Strength",
      sets: Number(sets) || 0,
      reps: Number(reps) || 0,
      weight: Number(weight) || 0,
      notes: notes || "",
      duration: duration || "",
      workoutDate: workoutDate || date || new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Workout Added Successfully",
      workout,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get All Workouts
// ==============================

const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: workouts.length,
      workouts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Single Workout
// ==============================

const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout Not Found",
      });
    }

    res.status(200).json({
      success: true,
      workout,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Workout
// ==============================

const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout Not Found",
      });
    }

    workout.exerciseName = req.body.exerciseName || req.body.name || workout.exerciseName;
    workout.category = req.body.category || workout.category;
    workout.sets = Number(req.body.sets) || workout.sets;
    workout.reps = Number(req.body.reps) || workout.reps;
    workout.weight = Number(req.body.weight) || workout.weight;
    workout.notes = req.body.notes || workout.notes;
    workout.duration = req.body.duration || workout.duration;
    workout.workoutDate = req.body.workoutDate || req.body.date || workout.workoutDate;

    const updatedWorkout = await workout.save();

    res.status(200).json({
      success: true,
      message: "Workout Updated Successfully",
      workout: updatedWorkout,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete Workout
// ==============================

const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout Not Found",
      });
    }

    await Workout.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Workout Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
};