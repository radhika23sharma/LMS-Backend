const express = require("express");
const router = express.Router();

const {
  addContent,
  getAllContent,
  getContentBySlug,
  updateContent,
  deleteContent,
} = require("../../controllers/admin/contentController");

const { authMiddleware, adminMiddleware } = require("../../middleware/authMiddleware");

// 👑 Admin Content Routes
router.post("/content", authMiddleware, adminMiddleware, addContent);
router.get("/content", authMiddleware, adminMiddleware, getAllContent);
router.get("/content/:slug", authMiddleware, adminMiddleware, getContentBySlug);
router.put("/content/:slug", authMiddleware, adminMiddleware, updateContent);
router.delete("/content/:slug", authMiddleware, adminMiddleware, deleteContent);

module.exports = router;
