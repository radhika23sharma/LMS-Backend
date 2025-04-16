const express = require("express");
const router = express.Router();
const { getAllContent, getContentBySlug } = require("../../controllers/student/studentContentController");

// 📥 Get All Content for Students
router.get("/", getAllContent);

// 📄 Get Content by Slug
router.get("/:slug", getContentBySlug);

module.exports = router;
