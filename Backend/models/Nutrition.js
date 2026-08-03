const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    mealType: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
      required: true,
    },

    foodName: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: String,
      required: true,
    },

    calories: {
      type: Number,
      default: 0,
    },

    protein: {
      type: Number,
      default: 0,
    },

    carbs: {
      type: Number,
      default: 0,
    },

    fats: {
      type: Number,
      default: 0,
    },

    notes: {
      type: String,
      default: "",
    },

    mealDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Nutrition", nutritionSchema);