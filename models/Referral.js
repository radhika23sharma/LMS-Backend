const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema({
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  referred: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional initially
  referralCode: { type: String, required: true },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  pointsEarned: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Referral", referralSchema);
