const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },

    chest: {
      type: Number,
      default: 0,
    },

    waist: {
      type: Number,
      default: 0,
    },

    biceps: {
      type: Number,
      default: 0,
    },

    runTime: {
      type: Number,
      default: 0,
    },

    liftingWeight: {
      type: Number,
      default: 0,
    },

    notes: {
      type: String,
      default: "",
    },

    progressDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Progress", progressSchema);