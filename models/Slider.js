const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String },
  description: { type: String },
  link: { type: String }, // optional - if image should redirect
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Slider", sliderSchema);
