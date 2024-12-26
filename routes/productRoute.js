const express = require("express");
const { createProduct, getAProduct, getAllProduct, updateProducts, deleteProducts, addToWishlist, rating } = require("../controller/productController");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");

router.post('/', authMiddleware, isAdmin, createProduct);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);

router.put("/:id", authMiddleware, isAdmin, updateProducts)
router.get("/:id", getAProduct)
router.delete("/:id", authMiddleware, isAdmin, deleteProducts)
router.get("/", getAllProduct)

module.exports = router