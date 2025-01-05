const Color = require("../models/colorModel")
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createColor = asyncHandler(async (req, res) => {
    try {
        const newColor = await Color.create(req.body);
        res.json({
            status: "success",
            newColor,
        })
    } catch (error) {
        res.status(500).json({ message: "Failed to create Color", error: error.message });
    }
});


// Get All Categories
const getAllColor = asyncHandler(async (req, res) => {

    try {
        const getColor = await Color.find();
        res.json({
            status: "success",
            getColor
        });
    }
    catch (error) {
        throw new Error(error);
    }

});

// Get Color by ID
const getAColor = asyncHandler(async (req, res) => {

    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getColor = await Color.findById(id);
        res.json({
            status: "success",
            getColor
        });
    }
    catch (error) {
        throw new Error(error);

    }
})

// Update Color
const updateColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateColor = await Color.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json({
            status: "sucess",
            updateColor
        });
    }
    catch (error) {
        throw new Error(error);
    }

});

// Delete ProductColor

const deleteColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteColor = await Color.findByIdAndDelete(id);
        res.json({
            status: "success",
            deleteColor
        });
    }
    catch (error) {
        throw new Error(error);
    }
});


module.exports = { createColor, updateColor, getAllColor, getAColor, deleteColor }