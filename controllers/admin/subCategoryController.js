const SubCategory = require("../../models/SubCategory");
const Subject = require("../../models/Subject");
const slugify = require("slugify");

// ➕ Add SubCategory
exports.addSubCategory = async (req, res) => {
    try {
        const { subject, name } = req.body;

        if (!subject || !name) {
            return res.status(400).json({ success: false, message: "Subject and name are required." });
        }

        const slug = slugify(name, { lower: true, strict: true });

        const existing = await SubCategory.findOne({ subject, slug });
        if (existing) {
            return res.status(400).json({ success: false, message: "Sub-category already exists." });
        }

        const newSubCategory = await SubCategory.create({ subject, name, slug });

        res.status(201).json({
            success: true,
            message: "Sub-category created successfully.",
            subCategory: newSubCategory,
        });
    } catch (error) {
        console.error("Add SubCategory Error:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

// 📥 Get All SubCategories (with optional subject filter)
exports.getAllSubCategories = async (req, res) => {
    try {
        const { subject } = req.query;
        let filter = {};

        if (subject) {
            const subjectDoc = await Subject.findOne({ slug: subject });
            if (!subjectDoc) {
                return res.status(404).json({ success: false, message: "Subject not found by slug." });
            }
            filter.subject = subjectDoc._id;
        }

        const subCategories = await SubCategory.find(filter)
            .populate("subject", "name slug")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: subCategories.length,
            subCategories,
        });
    } catch (error) {
        console.error("Get SubCategories Error:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};


// 📄 Get Single SubCategory by Slug
exports.getSubCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const subCategory = await SubCategory.findOne({ slug }).populate("subject", "name slug");

        if (!subCategory) {
            return res.status(404).json({ success: false, message: "Sub-category not found." });
        }

        res.json({ success: true, subCategory });
    } catch (error) {
        console.error("Get SubCategory Error:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

// ✏️ Update SubCategory
exports.updateSubCategory = async (req, res) => {
    try {
        const { slug } = req.params;
        const { name, subject } = req.body;

        const newSlug = slugify(name, { lower: true, strict: true });

        const updated = await SubCategory.findOneAndUpdate(
            { slug },
            { name, subject, slug: newSlug },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Sub-category not found." });
        }

        res.json({ success: true, message: "Sub-category updated successfully.", subCategory: updated });
    } catch (error) {
        console.error("Update SubCategory Error:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

// ❌ Delete SubCategory
exports.deleteSubCategory = async (req, res) => {
    try {
        const { slug } = req.params;

        const deleted = await SubCategory.findOneAndDelete({ slug });

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Sub-category not found." });
        }

        res.json({ success: true, message: "Sub-category deleted successfully." });
    } catch (error) {
        console.error("Delete SubCategory Error:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};
