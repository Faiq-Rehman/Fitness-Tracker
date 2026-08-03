const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addNutrition,
  getNutrition,
  getNutritionById,
  updateNutrition,
  deleteNutrition,
} = require("../controllers/nutritionController");

// Add Nutrition
router.post("/", protect, addNutrition);

// Get All Nutrition Records
router.get("/", protect, getNutrition);

// Get Nutrition By ID
router.get("/:id", protect, getNutritionById);

// Update Nutrition
router.put("/:id", protect, updateNutrition);

// Delete Nutrition
router.delete("/:id", protect, deleteNutrition);

module.exports = router;