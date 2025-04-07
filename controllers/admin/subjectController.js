const Subject = require("../../models/Subject");
const slugify = require("slugify");

// ➕ Add Subject
exports.addSubject = async (req, res) => {
  try {
    const { name, mainCategory, coverImage } = req.body;

    if (!name || !mainCategory) {
      return res.status(400).json({ success: false, message: "Name and Main Category are required." });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const existing = await Subject.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: "Subject already exists." });
    }

    const subject = await Subject.create({ name, slug, mainCategory, coverImage });

    res.status(201).json({
      success: true,
      message: "Subject created successfully.",
      subject,
    });
  } catch (error) {
    console.error("Add Subject Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// 📥 Get All Subjects (with search, pagination, sort)
exports.getAllSubjects = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10, sort = "createdAt", order = "desc" } = req.query;

    const query = {
      name: { $regex: search, $options: "i" }
    };

    const total = await Subject.countDocuments(query);

    const subjects = await Subject.find(query)
      .populate("mainCategory", "title slug")
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

    const subject = await Subject.findOne({ slug }).populate("mainCategory", "title slug");
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
    const { name, mainCategory, coverImage } = req.body;
    const { slug } = req.params;

    const newSlug = slugify(name, { lower: true, strict: true });

    const updated = await Subject.findOneAndUpdate(
      { slug },
      { name, slug: newSlug, mainCategory, coverImage },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Subject not found." });
    }

    res.json({
      success: true,
      message: "Subject updated successfully.",
      subject: updated,
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
