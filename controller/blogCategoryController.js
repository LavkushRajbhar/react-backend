const blogCategory = require("../models/blogCategoryModel")
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createBlogCategory = asyncHandler(async (req, res) => {
    try {
        const newblogCategory = await blogCategory.create(req.body);
        res.json({
            status: "success",
            newblogCategory,
        })
    } catch (error) {
        res.status(500).json({ message: "Failed to create blogCategory", error: error.message });
    }
});


// Get All Categories
const getAllBlogCategory = asyncHandler(async (req, res) => {

    try {
        const getAllCat = await blogCategory.find();
        res.json({
            status: "success",
            getAllCat
        });
    }
    catch (error) {
        throw new Error(error);
    }

});

// Get blogCategory by ID
const getABlogCategory = asyncHandler(async (req, res) => {

    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getACat = await blogCategory.findById(id);
        res.json({
            status: "success",
            getACat
        });
    }
    catch (error) {
        throw new Error(error);

    }
})

// Update blogCategory
const updateBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateCat = await blogCategory.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json({
            status: "sucess",
            updateCat
        });
    }
    catch (error) {
        throw new Error(error);
    }

});

// Delete ProductblogCategory

const deleteBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteCat = await blogCategory.findByIdAndDelete(id);
        res.json({
            status: "success",
            deleteCat
        });
    }
    catch (error) {
        throw new Error(error);
    }
});


module.exports = { createBlogCategory, updateBlogCategory, getAllBlogCategory, getABlogCategory, deleteBlogCategory }