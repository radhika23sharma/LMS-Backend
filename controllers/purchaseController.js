// controllers/purchaseController.js
const Purchase = require('../models/Purchase');
const Content = require('../models/Content');

// Create a new purchase
exports.createPurchase = async (req, res) => {
  try {
    const { userId, contentId, pricePaid, paymentId } = req.body;

    // Find the content being purchased
    const content = await Content.findById(contentId);

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    const newPurchase = new Purchase({
      user: userId,
      content: contentId,
      pricePaid: pricePaid,
      paymentId: paymentId,
      status: "completed", // Set to 'completed' assuming the payment is successful
      downloadLimit: content.downloadLimit || 5, // Set download limit from content (default is 5)
      downloadsRemaining: content.downloadLimit || 5, // Initialize remaining downloads
    });

    await newPurchase.save();
    res.status(201).json({ message: "Purchase created successfully", purchase: newPurchase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all purchases for a user
exports.getUserPurchases = async (req, res) => {
  try {
    const userId = req.params.userId;

    const purchases = await Purchase.find({ user: userId }).populate('content', 'title pdfUrl price'); // Populate content info

    if (purchases.length === 0) {
      return res.status(404).json({ message: "No purchases found for this user" });
    }

    res.status(200).json({ purchases });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Handle content download
exports.downloadContent = async (req, res) => {
  try {
    const purchaseId = req.params.purchaseId;

    // Find the purchase
    const purchase = await Purchase.findById(purchaseId);

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    // Check if downloads are remaining
    if (purchase.downloadsRemaining <= 0) {
      return res.status(400).json({ message: "Download limit exceeded" });
    }

    // Update the downloads remaining
    purchase.downloadsRemaining -= 1;
    await purchase.save();

    // Assuming we store the PDF URL in the content model
    const content = await Content.findById(purchase.content);
    if (!content || !content.pdfUrl) {
      return res.status(404).json({ message: "Content not available for download" });
    }

    // Send the download link or the content file (in a real app, you might stream the file or send a secure URL)
    res.status(200).json({ message: "Download successful", pdfUrl: content.pdfUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
