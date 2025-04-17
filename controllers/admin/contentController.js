const Content = require("../../models/Content");
const slugify = require("slugify");
const MainCategory = require('../../models/MainCategory');


// ➕ Add Content
exports.addContent = async (req, res) => {
  try {
    const {
      title,
      mainCategory,
      subject,
      subCategory,
      stream,
      pdfUrl,
      coverImage,
      isTextToSpeechEnabled,
      isFlipbookEnabled,
      isRestricted,
      price,
    } = req.body;

    if (!title || !mainCategory || !subject || !subCategory || !pdfUrl) {
      return res.status(400).json({
        success: false,
        message: "Required fields: title, mainCategory, subject, subCategory, pdfUrl",
      });
    }

    // ✅ Fetch main category to check class
    const mainCat = await MainCategory.findById(mainCategory);
    if (!mainCat) {
      return res.status(400).json({ success: false, message: "Invalid main category." });
    }

    const className = mainCat.title.toLowerCase();

    // ✅ Stream validation based on class
    if (className.includes("11") || className.includes("12")) {
      if (!stream) {
        return res.status(400).json({ success: false, message: "Stream is required for class 11th and 12th." });
      }
    } else {
      if (stream) {
        return res.status(400).json({ success: false, message: "Stream should not be provided for non 11th/12th classes." });
      }
    }

    const slug = slugify(title, { lower: true, strict: true });

    const existing = await Content.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: "Content already exists." });
    }

    const content = await Content.create({
      title,
      slug,
      mainCategory,
      subject,
      subCategory,
      stream: (className.includes("11") || className.includes("12")) ? stream : undefined,
      pdfUrl,
      coverImage,
      isTextToSpeechEnabled,
      isFlipbookEnabled,
      isRestricted,
      price,
    });

    res.status(201).json({
      success: true,
      message: "Content created successfully.",
      content,
    });
  } catch (error) {
    console.error("Add Content Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// 📥 Get All Content (search, sort, paginate)
exports.getAllContent = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10, sort = "createdAt", order = "desc" } = req.query;

    const query = {
      title: { $regex: search, $options: "i" }
    };

    const total = await Content.countDocuments(query);

    const contents = await Content.find(query)
      .populate("mainCategory", "title slug")
      .populate("subject", "name slug")
      .populate("subCategory", "name slug")
      .populate("stream", "name slug") // ✅ Populating stream
      .sort({ [sort]: order === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      contents,
    });
  } catch (error) {
    console.error("Get Content Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// 📄 Get Content by Slug
exports.getContentBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const content = await Content.findOne({ slug })
      .populate("mainCategory", "title slug")
      .populate("subject", "name slug")
      .populate("subCategory", "name slug")
      .populate("stream", "name slug"); // ✅ Added stream

    if (!content) {
      return res.status(404).json({ success: false, message: "Content not found." });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.error("Get Content By Slug Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ✏️ Update Content
exports.updateContent = async (req, res) => {
  try {
    const { slug } = req.params;
    const {
      title,
      mainCategory,
      subject,
      subCategory,
      stream, // ✅ Add stream
      pdfUrl,
      coverImage,
      isTextToSpeechEnabled,
      isFlipbookEnabled,
      isRestricted,
      price,
    } = req.body;

    const newSlug = slugify(title, { lower: true, strict: true });

    const updated = await Content.findOneAndUpdate(
      { slug },
      {
        title,
        slug: newSlug,
        mainCategory,
        subject,
        subCategory,
        stream, // ✅ Include stream
        pdfUrl,
        coverImage,
        isTextToSpeechEnabled,
        isFlipbookEnabled,
        isRestricted,
        price,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Content not found." });
    }

    res.json({
      success: true,
      message: "Content updated successfully.",
      content: updated,
    });
  } catch (error) {
    console.error("Update Content Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ❌ Delete Content
exports.deleteContent = async (req, res) => {
  try {
    const { slug } = req.params;

    const deleted = await Content.findOneAndDelete({ slug });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Content not found." });
    }

    res.json({ success: true, message: "Content deleted successfully." });
  } catch (error) {
    console.error("Delete Content Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
