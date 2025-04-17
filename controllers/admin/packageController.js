const Package = require("../../models/Package");
const slugify = require("slugify");

// ➕ Add Package
exports.addPackage = async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            durationInDays,
            contents,
            features,
            image,
        } = req.body;

        if (!title || !price || !durationInDays) {
            return res.status(400).json({
                success: false,
                message: "Required fields: title, price, durationInDays",
            });
        }

        const packageCount = await Package.countDocuments();
        if (packageCount >= 3) {
            return res.status(400).json({
                success: false,
                message: "Cannot add more than 3 packages.",
            });
        }

        const slug = slugify(title, { lower: true, strict: true });

        const existing = await Package.findOne({ slug });
        if (existing) {
            return res.status(400).json({ success: false, message: "Package already exists." });
        }

        const newPackage = await Package.create({
            title,
            slug,
            description,
            price,
            durationInDays,
            contents,
            features,
            image,
        });

        res.status(201).json({
            success: true,
            message: "Package created successfully.",
            package: newPackage,
        });
    } catch (error) {
        console.error("Add Package Error:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

// 📥 Get All Packages
exports.getAllPackages = async (req, res) => {
    try {
        const packages = await Package.find()
            .populate("contents", "title slug")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: packages.length,
            packages,
        });
    } catch (error) {
        console.error("Get All Packages Error:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

// 📄 Get Package by Slug
exports.getPackageBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const pack = await Package.findOne({ slug }).populate("contents", "title slug");

        if (!pack) {
            return res.status(404).json({ success: false, message: "Package not found." });
        }

        res.status(200).json({ success: true, package: pack });
    } catch (error) {
        console.error("Get Package By Slug Error:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

// ✏️ Update Package
exports.updatePackage = async (req, res) => {
    try {
        const { slug } = req.params;
        const {
            title,
            description,
            price,
            durationInDays,
            contents,
            features,
            image,
            isActive,
        } = req.body;

        const newSlug = slugify(title, { lower: true, strict: true });

        const existingSlug = await Package.findOne({ slug: newSlug });
        if (existingSlug && existingSlug.slug !== slug) {
            return res.status(400).json({
                success: false,
                message: "Package with this title already exists.",
            });
        }

        const updated = await Package.findOneAndUpdate(
            { slug },
            {
                title,
                slug: newSlug,
                description,
                price,
                durationInDays,
                contents,
                features,
                image,
                isActive,
            },
            { new: true }
        ).populate("contents", "title slug");

        if (!updated) {
            return res.status(404).json({ success: false, message: "Package not found." });
        }

        res.json({
            success: true,
            message: "Package updated successfully.",
            package: updated,
        });
    } catch (error) {
        console.error("Update Package Error:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

// ❌ Delete Package
exports.deletePackage = async (req, res) => {
    try {
        const { slug } = req.params;

        const deleted = await Package.findOneAndDelete({ slug });

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Package not found." });
        }

        res.json({ success: true, message: "Package deleted successfully." });
    } catch (error) {
        console.error("Delete Package Error:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};
