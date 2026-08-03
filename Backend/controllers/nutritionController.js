const Nutrition = require("../models/Nutrition");

// ==============================
// Add Nutrition
// ==============================

const addNutrition = async (req, res) => {
  try {
    const {
      mealType,
      foodName,
      quantity,
      calories,
      protein,
      carbs,
      fats,
      mealDate,
      date,
      notes,
    } = req.body;

    const nutrition = await Nutrition.create({
      userId: req.user._id,
      mealType: mealType || "Breakfast",
      foodName: foodName || "Meal",
      quantity: quantity || "",
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fats: Number(fats) || 0,
      notes: notes || "",
      mealDate: mealDate || date || new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Nutrition Added Successfully",
      nutrition,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get All Nutrition Records
// ==============================

const getNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: nutrition.length,
      nutrition,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Nutrition By ID
// ==============================

const getNutritionById = async (req, res) => {
  try {
    const nutrition = await Nutrition.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!nutrition) {
      return res.status(404).json({
        success: false,
        message: "Nutrition Record Not Found",
      });
    }

    res.status(200).json({
      success: true,
      nutrition,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Nutrition
// ==============================

const updateNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!nutrition) {
      return res.status(404).json({
        success: false,
        message: "Nutrition Record Not Found",
      });
    }

    nutrition.foodName = req.body.foodName || req.body.mealName || nutrition.foodName;
    nutrition.quantity = req.body.quantity || nutrition.quantity;
    nutrition.mealType = req.body.mealType || nutrition.mealType;
    nutrition.calories = Number(req.body.calories) || nutrition.calories;
    nutrition.protein = Number(req.body.protein) || nutrition.protein;
    nutrition.carbs = Number(req.body.carbs) || nutrition.carbs;
    nutrition.fats = Number(req.body.fats) || nutrition.fats;
    nutrition.notes = req.body.notes || nutrition.notes;
    nutrition.mealDate = req.body.mealDate || req.body.date || nutrition.mealDate;

    const updatedNutrition = await nutrition.save();

    res.status(200).json({
      success: true,
      message: "Nutrition Updated Successfully",
      nutrition: updatedNutrition,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete Nutrition
// ==============================

const deleteNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!nutrition) {
      return res.status(404).json({
        success: false,
        message: "Nutrition Record Not Found",
      });
    }

    await Nutrition.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Nutrition Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addNutrition,
  getNutrition,
  getNutritionById,
  updateNutrition,
  deleteNutrition,
};