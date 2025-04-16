const Content = require("../../models/Content");

// 📥 Get All Content for Students (No token required)
exports.getAllContent = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10, sort = "createdAt", order = "desc" } = req.query;

    // Build the search query
    const query = {
      title: { $regex: search, $options: "i" } // Search by title, case-insensitive
    };

    // Get the total count of matching documents
    const total = await Content.countDocuments(query);

    // Fetch the content based on query parameters (pagination, sorting)
    const contents = await Content.find(query)
      .populate("mainCategory", "title slug") // Populating related categories
      .populate("subject", "name slug")
      .populate("subCategory", "name slug")
      .sort({ [sort]: order === "desc" ? -1 : 1 }) // Sorting by the given field and order
      .skip((page - 1) * limit) // Pagination logic
      .limit(Number(limit)); // Limit the number of results

    // Send the response with paginated content
    res.status(200).json({
      success: true,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit), // Calculate total pages based on total count and limit
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

    // Fetch content by slug and populate related categories
    const content = await Content.findOne({ slug })
      .populate("mainCategory", "title slug")
      .populate("subject", "name slug")
      .populate("subCategory", "name slug");

    if (!content) {
      return res.status(404).json({ success: false, message: "Content not found." });
    }

    // Send the response with the content details
    res.status(200).json({
      success: true,
      content,
    });
  } catch (error) {
    console.error("Get Content By Slug Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
