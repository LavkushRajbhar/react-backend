const Enquiry = require("../models/enqModel")
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createEnquiry = asyncHandler(async (req, res) => {
    try {
        const newEnquiry = await Enquiry.create(req.body);
        res.json({
            status: "success",
            newEnquiry,
        })
    } catch (error) {
        res.status(500).json({ message: "Failed to create Enquiry", error: error.message });
    }
});


// Get All Categories
const getAllEnquiry = asyncHandler(async (req, res) => {

    try {
        const getEnquiry = await Enquiry.find();
        res.json({
            status: "success",
            getEnquiry
        });
    }
    catch (error) {
        throw new Error(error);
    }

});

// Get Enquiry by ID
const getAEnquiry = asyncHandler(async (req, res) => {

    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getEnquiry = await Enquiry.findById(id);
        res.json({
            status: "success",
            getEnquiry
        });
    }
    catch (error) {
        throw new Error(error);

    }
})

// Update Enquiry
const updateEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json({
            status: "sucess",
            updateEnquiry
        });
    }
    catch (error) {
        throw new Error(error);
    }

});

// Delete ProductEnquiry

const deleteEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteEnquiry = await Enquiry.findByIdAndDelete(id);
        res.json({
            status: "success",
            deleteEnquiry
        });
    }
    catch (error) {
        throw new Error(error);
    }
});


module.exports = { createEnquiry, updateEnquiry, getAllEnquiry, getAEnquiry, deleteEnquiry }