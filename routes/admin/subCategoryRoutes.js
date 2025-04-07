const express = require("express");
const router = express.Router();
const {
  addSubCategory,
  getAllSubCategories,
  getSubCategoryBySlug,
  updateSubCategory,
  deleteSubCategory,
} = require("../../controllers/admin/subCategoryController");

const { authMiddleware, adminMiddleware } = require("../../middleware/authMiddleware");

// 👑 Admin Routes
router.post("/sub-category", authMiddleware, adminMiddleware, addSubCategory);
router.get("/sub-categories", authMiddleware, adminMiddleware, getAllSubCategories);
router.get("/sub-category/:slug", authMiddleware, adminMiddleware, getSubCategoryBySlug);
router.put("/sub-category/:slug", authMiddleware, adminMiddleware, updateSubCategory);
router.delete("/sub-category/:slug", authMiddleware, adminMiddleware, deleteSubCategory);

module.exports = router;
