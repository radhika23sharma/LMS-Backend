const mongoose = require("mongoose");
const slugify = require("slugify");

function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/class\s*/gi, "")
    .replace(/th|st|nd|rd/gi, "")
    .replace(/[^a-z0-9]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const mainCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
}, { timestamps: true });

mainCategorySchema.pre("save", function (next) {
  if (this.isModified("title")) {
    const normalized = normalizeTitle(this.title);
    this.slug = slugify(normalized, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("MainCategory", mainCategorySchema);
