const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Content",
    required: true,
  },
  purchasedAt: {
    type: Date,
    default: Date.now,
  },
  pricePaid: {
    type: Number,
    required: true, // Price that the user paid for the content
  },
  paymentId: {
    type: String, // For payment gateway integration like Razorpay
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed",
  },
  downloadLimit: {
    type: Number,
    default: 5, // The number of downloads allowed for this content
  },
  downloadsRemaining: {
    type: Number,
    default: 5, // Tracks remaining downloads
  },
  accessExpiresAt: {
    type: Date, // If content has an expiration date, such as subscription-based access
  },
}, { timestamps: true });

module.exports = mongoose.model("Purchase", purchaseSchema);
