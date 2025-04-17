const mongoose = require("mongoose");
const slugify = require("slugify");

const streamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    mainCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MainCategory", // 11th / 12th class
      required: true,
    },
  },
  { timestamps: true }
);

// 🔁 Generate slug before saving
streamSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Stream", streamSchema);
