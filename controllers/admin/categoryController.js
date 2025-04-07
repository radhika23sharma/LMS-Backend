const MainCategory = require("../../models/MainCategory");
const slugify = require("slugify");

// ➕ Add Main Category
exports.addMainCategory = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) return res.status(400).json({ success: false, message: "Title is required." });

    const slug = slugify(title, { lower: true, strict: true });

    const existing = await MainCategory.findOne({ slug });
    if (existing) return res.status(400).json({ success: false, message: "Category already exists." });

    const newCategory = await MainCategory.create({ title, slug });

    res.status(201).json({
      success: true,
      message: "Main category created successfully.",
      category: newCategory,
    });
  } catch (error) {
    console.error("Add Category Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// 📥 Get All (with Search + Pagination + Sort)
exports.getAllMainCategories = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10, sort = "createdAt", order = "desc" } = req.query;

    const query = {
      title: { $regex: search, $options: "i" }
    };

    const total = await MainCategory.countDocuments(query);

    const categories = await MainCategory.find(query)
      .sort({ [sort]: order === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      categories,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// 📄 Get Single Category by Slug
exports.getMainCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await MainCategory.findOne({ slug });

    if (!category) return res.status(404).json({ success: false, message: "Category not found." });

    res.json({ success: true, category });
  } catch (error) {
    console.error("Get Category Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ✏️ Update Category
exports.updateMainCategory = async (req, res) => {
  try {
    const { title } = req.body;
    const { slug } = req.params;

    const newSlug = slugify(title, { lower: true, strict: true });

    const updated = await MainCategory.findOneAndUpdate(
      { slug },
      { title, slug: newSlug },
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: "Category not found." });

    res.json({
      success: true,
      message: "Category updated successfully.",
      category: updated,
    });
  } catch (error) {
    console.error("Update Category Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ❌ Delete Category
exports.deleteMainCategory = async (req, res) => {
  try {
    const { slug } = req.params;

    const deleted = await MainCategory.findOneAndDelete({ slug });

    if (!deleted) return res.status(404).json({ success: false, message: "Category not found." });

    res.json({ success: true, message: "Category deleted successfully." });
  } catch (error) {
    console.error("Delete Category Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
