const express = require("express");
const router = express.Router();

const {
  addSubject,
  getAllSubjects,
  getSubjectBySlug,
  updateSubject,
  deleteSubject,
} = require("../../controllers/admin/subjectController");

const { authMiddleware, adminMiddleware } = require("../../middleware/authMiddleware");

// 👑 Admin Subject Routes
router.post("/subjects", authMiddleware, adminMiddleware, addSubject);
router.get("/subjects", authMiddleware, adminMiddleware, getAllSubjects);
router.get("/subject/:slug", authMiddleware, adminMiddleware, getSubjectBySlug);
router.put("/subject/:slug", authMiddleware, adminMiddleware, updateSubject);
router.delete("/subject/:slug", authMiddleware, adminMiddleware, deleteSubject);

module.exports = router;
