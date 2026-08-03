const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    theme: {
      type: String,
      enum: ["Light", "Dark"],
      default: "Light",
    },

    measurementUnit: {
      type: String,
      enum: ["Metric", "Imperial"],
      default: "Metric",
    },

    notifications: {
      type: Boolean,
      default: true,
    },

    language: {
      type: String,
      default: "English",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Setting", settingSchema);