const Subject = require("../../models/Subject");
const slugify = require("slugify");
const MainCategory = require("../../models/MainCategory"); // Make sure MainCategory is imported
const Stream = require("../../models/Stream");

// ➕ Add Subject
exports.addSubject = async (req, res) => {
  try {
    const { name, stream, coverImage } = req.body;

    // Fetch Stream to get MainCategory info
    const streamDoc = await Stream.findById(stream);
    if (!streamDoc) {
      return res.status(400).json({ success: false, message: "Invalid Stream." });
    }

    const mainCategory = streamDoc.mainCategory; // Get mainCategory from the stream

    // Validate Stream if class is 11th or 12th
    if ((mainCategory.className === "11th" || mainCategory.className === "12th") && !stream) {
      return res.status(400).json({ success: false, message: "Stream is required for class 11th and 12th." });
    }

    // Check if subject with the same slug exists
    const existing = await Subject.findOne({ slug: slugify(name, { lower: true, strict: true }) });
    if (existing) {
      return res.status(400).json({ success: false, message: "Subject already exists." });
    }

    // Create the new subject
    const subject = await Subject.create({ name, mainCategory, stream, coverImage });

    // Populate the 'stream' and 'mainCategory' after creating the subject
    const populatedSubject = await Subject.findById(subject._id).populate("mainCategory", "title slug").populate("stream", "name slug");

    res.status(201).json({
      success: true,
      message: "Subject created successfully.",
      subject: populatedSubject,
    });
  } catch (error) {
    console.error("Add Subject Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};


// 📄 Get All Subjects (with search, pagination, sort)
exports.getAllSubjects = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10, sort = "createdAt", order = "desc" } = req.query;

    const query = {
      name: { $regex: search, $options: "i" }
    };

    const total = await Subject.countDocuments(query);

    const subjects = await Subject.find(query)
      .populate("mainCategory", "title slug")
      .populate("stream", "name slug") // Populate stream name
      .sort({ [sort]: order === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      subjects,
    });
  } catch (error) {
    console.error("Get Subjects Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// 📄 Get Single Subject by Slug
exports.getSubjectBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const subject = await Subject.findOne({ slug })
      .populate("mainCategory", "title slug")
      .populate("stream", "name slug"); // Populate stream name
    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found." });
    }

    res.json({ success: true, subject });
  } catch (error) {
    console.error("Get Subject Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};


// ✏️ Update Subject
exports.updateSubject = async (req, res) => {
  try {
    const { name, mainCategory, stream, coverImage } = req.body;
    const { slug } = req.params;

    // Fetch MainCategory to get class info
    const mainCat = await MainCategory.findById(mainCategory);
    if (!mainCat) {
      return res.status(400).json({ success: false, message: "Invalid Main Category." });
    }

    // Validate Stream if class is 11th or 12th
    if ((mainCat.className === "11th" || mainCat.className === "12th") && !stream) {
      return res.status(400).json({ success: false, message: "Stream is required for class 11th and 12th." });
    }

    // Check if subject with the same slug exists before updating
    const existingSlug = await Subject.findOne({ slug: slugify(name, { lower: true, strict: true }) });
    if (existingSlug) {
      return res.status(400).json({ success: false, message: "Subject already exists with this name." });
    }

    // Update the subject
    const updated = await Subject.findOneAndUpdate(
      { slug },
      { name, slug: slugify(name, { lower: true, strict: true }), mainCategory, stream, coverImage },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Subject not found." });
    }

    // Populate the updated stream and mainCategory
    const populatedSubject = await Subject.findById(updated._id).populate("stream", "name slug").populate("mainCategory", "title slug");

    res.json({
      success: true,
      message: "Subject updated successfully.",
      subject: populatedSubject,
    });
  } catch (error) {
    console.error("Update Subject Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};



// ❌ Delete Subject
exports.deleteSubject = async (req, res) => {
  try {
    const { slug } = req.params;

    const deleted = await Subject.findOneAndDelete({ slug });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Subject not found." });
    }

    res.json({ success: true, message: "Subject deleted successfully." });
  } catch (error) {
    console.error("Delete Subject Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
