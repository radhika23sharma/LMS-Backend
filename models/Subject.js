const mongoose = require("mongoose");
const slugify = require("slugify");

const subjectSchema = new mongoose.Schema(
  {
    mainCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MainCategory",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    coverImage: {
      type: String, // this can be a cloud URL or local path
      required: false,
    },
  },
  { timestamps: true }
);

// 🧠 Pre-save hook to generate slug
subjectSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Subject", subjectSchema);
