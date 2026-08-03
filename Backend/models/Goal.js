const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    goalType: {
      type: String,
      enum: [
        "Weight Loss",
        "Weight Gain",
        "Muscle Gain",
        "Maintain Weight",
        "Custom",
      ],
      required: true,
    },

    target: {
      type: Number,
      required: true,
    },

    currentValue: {
      type: Number,
      default: 0,
    },

    deadline: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Goal", goalSchema);