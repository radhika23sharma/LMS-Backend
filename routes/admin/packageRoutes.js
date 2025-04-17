const express = require("express");
const router = express.Router();
const {
  addPackage,
  getAllPackages,
  getPackageBySlug,
  updatePackage,
  deletePackage,
} = require("../../controllers/admin/packageController");

const { authMiddleware, adminMiddleware } = require("../../middleware/authMiddleware");

// 👑 Admin Package Routes
router.post("/package", authMiddleware, adminMiddleware, addPackage);
router.get("/package", authMiddleware, adminMiddleware, getAllPackages);
router.get("/package/:slug", authMiddleware, adminMiddleware, getPackageBySlug);
router.put("/package/:slug", authMiddleware, adminMiddleware, updatePackage);
router.delete("/package/:slug", authMiddleware, adminMiddleware, deletePackage);

module.exports = router;
