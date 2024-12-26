const Coupon = require("../models/couponModel");
const ValidateMongoDbId = require("../utils/validateMongodbId");
const asyncHandler = require("express-async-handler")


const createCoupon = asyncHandler(async (req, res) => {

    try {
        const newCoupon = await Coupon.create(req.body);
        res.status(201).json(newCoupon);
    }
    catch (error) {
    throw new Error(error)
    }
    
})


module.exports = {};