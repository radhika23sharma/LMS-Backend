const Stream = require("../../models/Stream");
const slugify = require("slugify");

// 🔁 Normalize stream name
function normalizeName(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// ➕ Add Stream

exports.addStream = async (req, res) => {
    try {
        const { name, mainCategory } = req.body;
        const newStream = new Stream({ name, mainCategory });
        await newStream.save();
        res.status(201).json({ success: true, message: "Stream created successfully.", stream: newStream });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


// 📥 Get All Streams
exports.getAllStreams = async (req, res) => {
    try {
        const { search = "", page = 1, limit = 10, sort = "createdAt", order = "desc" } = req.query;

        const query = {
            name: { $regex: search, $options: "i" },
        };

        const total = await Stream.countDocuments(query);

        const streams = await Stream.find(query)
            .populate("mainCategory", "title slug") // Optional
            .sort({ [sort]: order === "desc" ? -1 : 1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            streams,
        });
    } catch (error) {
        console.error("Get Streams Error:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

// 📄 Get Single Stream by Slug
exports.getStreamBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const stream = await Stream.findOne({ slug }).populate("mainCategory", "title slug");

        if (!stream) {
            return res.status(404).json({ success: false, message: "Stream not found." });
        }

        res.json({ success: true, stream });
    } catch (error) {
        console.error("Get Stream Error:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

// ✏️ Update Stream
exports.updateStream = async (req, res) => {
    try {
        const { name, mainCategory } = req.body;
        const { slug } = req.params;

        const newNormalized = normalizeName(name);
        const newSlug = slugify(newNormalized, { lower: true, strict: true });

        const updated = await Stream.findOneAndUpdate(
            { slug },
            { name, slug: newSlug, mainCategory },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Stream not found." });
        }

        res.json({ success: true, message: "Stream updated successfully.", stream: updated });
    } catch (error) {
        console.error("Update Stream Error:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

// ❌ Delete Stream
exports.deleteStream = async (req, res) => {
    try {
        const { slug } = req.params;
        const deleted = await Stream.findOneAndDelete({ slug });

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Stream not found." });
        }

        res.json({ success: true, message: "Stream deleted successfully." });
    } catch (error) {
        console.error("Delete Stream Error:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};
