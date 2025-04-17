const mongoose = require("mongoose");
const slugify = require("slugify");

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    durationInDays: {
      type: Number,
      required: true,
    },
    contents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Content",
      },
    ],
    features: [
      {
        type: String,
      },
    ],
    image: {
      type: String, // URL of the package image (e.g. from Cloudinary or local storage)
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

packageSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Package", packageSchema);
