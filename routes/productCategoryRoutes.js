const express = require("express");
const router = express.Router();
const { createCategory, updateCategory, getAllCategory, getACategory, deleteCategory } = require("../controller/productCategoryController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, isAdmin, createCategory)
router.get("/", getAllCategory)
router.get("/:id", getACategory)
router.put("/:id", authMiddleware, isAdmin, updateCategory)
router.delete("/:id", authMiddleware, isAdmin, deleteCategory)


module.exports = router;