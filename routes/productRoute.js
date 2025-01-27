const express = require("express");
const { createProduct, getAProduct, getAllProduct, updateProducts, deleteProducts, addToWishlist, rating, uploadImages, deleteImages } = require("../controller/productController");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImages");

router.post('/', authMiddleware, isAdmin, createProduct);
router.put('/upload', authMiddleware, isAdmin, uploadPhoto.array('images', 10), productImgResize, uploadImages)
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);

router.put("/:id", authMiddleware, isAdmin, updateProducts)
router.get("/:id", getAProduct)
router.delete("/:id", authMiddleware, isAdmin, deleteProducts)
router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages)
router.get("/", getAllProduct)

module.exports = router