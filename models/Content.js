const mongoose = require("mongoose");
const slugify = require("slugify");

const contentSchema = new mongoose.Schema(
  {
    mainCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MainCategory",
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    stream: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stream",
      // We'll conditionally set required based on the class
      required: false, // Default is false, but we’ll modify it later
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String, // Optional: show thumbnail of the book
    },
    isTextToSpeechEnabled: {
      type: Boolean,
      default: false,
    },
    isFlipbookEnabled: {
      type: Boolean,
      default: false,
    },
    isRestricted: {
      type: Boolean,
      default: true, // true = cannot copy/download unless purchased
    },
    price: {
      type: Number,
      default: 0, // 0 = free, >0 = paid
    },
  },
  { timestamps: true }
);

// 🧠 Auto-generate slug from title
contentSchema.pre("save", async function (next) {
  
  // Auto-generate slug if the title is modified
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  next();
});

module.exports = mongoose.model("Content", contentSchema);
