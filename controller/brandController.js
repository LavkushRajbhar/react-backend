const Brand = require("../models/brandModel")
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createBrand = asyncHandler(async (req, res) => {
    try {
        const newBrand = await Brand.create(req.body);
        res.json({
            status: "success",
            newBrand,
        })
    } catch (error) {
        res.status(500).json({ message: "Failed to create Brand", error: error.message });
    }
});


// Get All Categories
const getAllBrand = asyncHandler(async (req, res) => {

    try {
        const getBrand = await Brand.find();
        res.json({
            status: "success",
            getBrand
        });
    }
    catch (error) {
        throw new Error(error);
    }

});

// Get Brand by ID
const getABrand = asyncHandler(async (req, res) => {

    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getBrand = await Brand.findById(id);
        res.json({
            status: "success",
            getBrand
        });
    }
    catch (error) {
        throw new Error(error);

    }
})

// Update Brand
const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateBrand = await Brand.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json({
            status: "sucess",
            updateBrand
        });
    }
    catch (error) {
        throw new Error(error);
    }

});

// Delete ProductBrand

const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteBrand = await Brand.findByIdAndDelete(id);
        res.json({
            status: "success",
            deleteBrand
        });
    }
    catch (error) {
        throw new Error(error);
    }
});


module.exports = { createBrand, updateBrand, getAllBrand, getABrand, deleteBrand }