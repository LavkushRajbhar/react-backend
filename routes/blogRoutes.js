const express = require("express");
const { createBlog, updateBlog, getABlog, getAllBlog, deleteBlog, likeBlog, disLikeBlog, uploadBlogImages } = require("../controller/blogController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { uploadPhoto, blogImgResize } = require("../middlewares/uploadImages");
const router = express.Router();


router.post('/', authMiddleware, isAdmin, createBlog)
router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array('images', 2), blogImgResize, uploadBlogImages)
router.put('/likes', authMiddleware, isAdmin, likeBlog)
router.put('/dislikes', authMiddleware, isAdmin, disLikeBlog)
router.put('/:id', authMiddleware, isAdmin, updateBlog)
router.delete('/:id', authMiddleware, isAdmin, deleteBlog)
router.get('/:id', getABlog)
router.get('/', getAllBlog)

module.exports = router;


