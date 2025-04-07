const express = require("express");
const router = express.Router();
const {
  addMainCategory,
  getAllMainCategories,
  getMainCategoryBySlug,
  updateMainCategory,
  deleteMainCategory,
} = require("../../controllers/admin/categoryController");

const { authMiddleware, adminMiddleware } = require("../../middleware/authMiddleware");

// 👑 Admin Routes
router.post("/main-category", authMiddleware, adminMiddleware, addMainCategory);
router.get("/main-categories", authMiddleware, adminMiddleware, getAllMainCategories);
router.get("/main-category/:slug", authMiddleware, adminMiddleware, getMainCategoryBySlug);
router.put("/main-category/:slug", authMiddleware, adminMiddleware, updateMainCategory);
router.delete("/main-category/:slug", authMiddleware, adminMiddleware, deleteMainCategory);

module.exports = router;
