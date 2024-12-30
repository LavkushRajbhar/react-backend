const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');
const cloudinaryUploadImg = require('../utils/cloudinary');
const fs = require('fs');
// Create a new blog post

const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json({
            status: "success",
            newBlog,
        })
    }
    catch (error) {
        throw new Error(error);
    }
});
const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json({
            status: "success",
            updateBlog,
        });
    }
    catch (error) {
        throw new Error(error);
    }
});


const getABlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const getABlog = await Blog.findById(id).populate("likes");
        const updateViews=await Blog.findByIdAndUpdate(id, 
            {
                $inc: { numViews: 1 },
            },
            { new: true },
        );
        res.json({
            status: "success",
            getABlog,
            
        });
    }
    catch (error) {
        throw new Error(error);
    }
});


// get all blogs

const getAllBlog = asyncHandler(async (req, res) => {
    try {
        const getBlogs = await Blog.find();
        res.json({
            status: "success",
            getBlogs,
        });
    }
    catch (error) {
        throw new Error(error);
    }


});

// Delete a blog post

const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBlog = await Blog.findByIdAndDelete(id);
        res.json({
            status: "success",
            deletedBlog,
        });
    }
    catch (error) {
        throw new Error(error);
    }
});


// like blog and dislike blogs

const likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);
    // find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    // find the login user
    const loginUserId = req?.user?._id;
    // find if the user liked the blog
    const isLiked = blog?.isLiked;
    //find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find((userId => userId?.toString() === loginUserId?.toString()));
    // if the user has already disliked the blog then remove from dislikes array and increment likes count
    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
        },
            { new: true })

        res.json({
            status: "success",
            message: "Blog liked successfully",
            blog,
        })
    };
    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false,
        },
            { new: true })

        res.json({
            status: "success",
            message: "Blog liked successfully",
            blog,
        })
    } else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: { likes: loginUserId },
            isLiked: true,
        },
            { new: true })

        res.json({
            status: "success",
            message: "Blog liked successfully",
            blog,
        })
    }
});


const disLikeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);

    // Find the blog to be disliked
    const blog = await Blog.findById(blogId);
    if (!blog) {
        res.status(404);
        throw new Error("Blog not found");
    }

    // Find the logged-in user's ID
    const loginUserId = req?.user?._id;

    // Check if the blog is already disliked
    const isDisliked = blog?.isDisliked;

    // Check if the user has already liked the blog
    const alreadyLiked = blog?.likes?.find(userId => userId.toString() === loginUserId.toString());

    // If the user already liked the blog, remove their like
    if (alreadyLiked) {
        await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false,
        });
    }

    // Toggle dislike status
    if (isDisliked) {
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
        }, { new: true });

        res.json({
            status: "success",
            message: "Blog undisliked successfully",
            blog: updatedBlog,
        });
    } else {
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            $push: { dislikes: loginUserId },
            isDisliked: true,
        }, { new: true });

        res.json({
            status: "success",
            message: "Blog disliked successfully",
            blog: updatedBlog,
        });
    }
});



const uploadBlogImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;

        for (const file of files) {
            const { path } = file;
            // console.log('Uploading file:', path); // Debugging log
            const newPath = await uploader(path);
            urls.push(newPath.url); // Extract URL
            fs.unlinkSync(path); // Delete the local file after uploading to Cloudinary
        }

        // console.log('Uploaded URLs:', urls); // Debugging log

        const findBlog = await Blog.findByIdAndUpdate(
            id,
            { images: urls },
            { new: true }
        );

        console.log('Updated Product:', findProduct); // Debugging log

        res.json(findBlog);
    } catch (error) {
        console.error('Error in uploadImages:', error); // Log errors
        throw new Error("Invalid product ID");
    }
});

module.exports = { createBlog, updateBlog, getABlog, getAllBlog, deleteBlog, likeBlog, disLikeBlog, uploadBlogImages };