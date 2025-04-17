// routes/admin/streamRoutes.js
const express = require("express");
const router = express.Router();

const {
  addStream,
  getAllStreams,
  getStreamBySlug,
  updateStream,
  deleteStream,
} = require("../../controllers/admin/streamController");

const { authMiddleware, adminMiddleware } = require("../../middleware/authMiddleware");

// 👑 Admin Stream Routes
router.post("/stream", authMiddleware, adminMiddleware, addStream);
router.get("/streams", authMiddleware, adminMiddleware, getAllStreams);
router.get("/stream/:slug", authMiddleware, adminMiddleware, getStreamBySlug);
router.put("/stream/:slug", authMiddleware, adminMiddleware, updateStream);
router.delete("/stream/:slug", authMiddleware, adminMiddleware, deleteStream);

module.exports = router;
