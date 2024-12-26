const express = require("express");
const router = express.Router();
const { createBlogCategory, updateBlogCategory, getAllBlogCategory, getABlogCategory, deleteBlogCategory } = require("../controller/BlogCategoryController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, isAdmin, createBlogCategory)
router.get("/", getAllBlogCategory)
router.get("/:id", getABlogCategory)
router.put("/:id", authMiddleware, isAdmin, updateBlogCategory)
router.delete("/:id", authMiddleware, isAdmin, deleteBlogCategory)


module.exports = router;