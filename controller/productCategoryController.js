const Category = require("../models/productCategoryModel")
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.json({
            status: "success",
            newCategory,
        })
    } catch (error) {
        res.status(500).json({ message: "Failed to create category", error: error.message });
    }
});


// Get All Categories
const getAllCategory = asyncHandler(async (req, res) => {

    try {
        const getAllCat = await Category.find();
        res.json({
            status: "success",
            getAllCat
        });
    }
    catch (error) {
        throw new Error(error);
    }

});

// Get Category by ID
const getACategory = asyncHandler(async (req, res) => {

    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getACat = await Category.findById(id);
        res.json({
            status: "success",
            getACat
        });
    }
    catch (error) {
        throw new Error(error);

    }
})

// Update Category
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateCat = await Category.findByIdAndUpdate(id, req.body, {
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

// Delete ProductCategory

const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteCat = await Category.findByIdAndDelete(id);
        res.json({
            status: "success",
            deleteCat
        });
    }
    catch (error) {
        throw new Error(error);
    }
});




module.exports = { createCategory, updateCategory, getAllCategory, getACategory, deleteCategory }