const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    withdrawnPoints: {
      type: Number,
      default: 0,
    },
    availablePoints: {
      type: Number,
      default: 0,
    },
    history: [
      {
        points: Number,
        type: { type: String, enum: ["earned", "withdrawn"], default: "earned" },
        note: String,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reward", rewardSchema);
