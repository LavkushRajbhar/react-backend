const express = require("express");
const router = express.Router();
const { createBrand, updateBrand, getAllBrand, getABrand, deleteBrand } = require("../controller/BrandController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, isAdmin, createBrand)
router.get("/", getAllBrand)
router.get("/:id", getABrand)
router.put("/:id", authMiddleware, isAdmin, updateBrand)
router.delete("/:id", authMiddleware, isAdmin, deleteBrand)


module.exports = router;