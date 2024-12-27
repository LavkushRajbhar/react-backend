const Coupon = require("../models/couponModel");
const ValidateMongoDbId = require("../utils/validateMongodbId");
const asyncHandler = require("express-async-handler")


const createCoupon = asyncHandler(async (req, res) => {

    try {
        const newCoupon = await Coupon.create(req.body);
        res.json({ message: "Coupon Created Successfully", newCoupon });
    }
    catch (error) {
        throw new Error(error)
    }

});

const getAllCoupon = asyncHandler(async (req, res) => {

    try {
        const allCoupons = await Coupon.find();
        res.json({ message: "All Coupons ", allCoupons });
    }
    catch (error) {
        throw new Error(error)
    }

});
const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const updateCoupons = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ message: "Coupon Updated Successfully ", updateCoupons });
    }
    catch (error) {
        throw new Error(error)
    }

});


const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deleteCoupons = await Coupon.findByIdAndDelete(id);
        res.json({ message: "Coupon Deleted Successfully ", deleteCoupons });
    }
    catch (error) {
        throw new Error(error)
    }

});


module.exports = { createCoupon, getAllCoupon, updateCoupon, deleteCoupon };