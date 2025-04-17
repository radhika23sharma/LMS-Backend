const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
  {
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referredTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
    rewardPoints: {
      type: Number,
      default: 0,
    },
    coursePurchased: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Referral", referralSchema);
