const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const User = require("../models/userModel");
const validateMongoDbId = require("../utils/validateMongodbId");
const fs = require("fs");
const {cloudinaryUploadImg, cloudinaryDeleteImg } = require("../utils/cloudinary");
// create product
const createProduct = asyncHandler(async (req, res) => {

    try {
        if (req.body.title) {

            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);

    } catch (error) {
        throw new Error(error)
    }
});

//update a product

const updateProducts = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }

        const updateProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updateProduct)
    }
    catch (error) {
        throw new Error(error);
    }

});


const deleteProducts = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the ID exists and proceed to delete
        const deleteProduct = await Product.findOneAndDelete({ _id: id });

        if (!deleteProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully", deleteProduct });
    } catch (error) {
        throw new Error(error);
    }
});





//get a product by its id
const getAProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const findProduct = await Product.findById(id)
        res.json(findProduct);
    }
    catch (error) {
        throw new Error(error)
    }
})

const getAllProduct = asyncHandler(async (req, res) => {

    try {
        //filtering
        const queryObj = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach((el) => delete queryObj[el]);

        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        let query = Product.find(JSON.parse(queryString));

        //Sorting

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(" ");
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt');
        }

        // Limiting the fields

        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        // pagination

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error("This page does not exits")
        }
        console.log(page, limit, skip);



        const product = await query;
        res.json(product);
    }
    catch (error) {
        throw new Error(error);
    }
})


// Add to Wishlist

const addToWishlist = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { prodId } = req.body;
    try {
        const user = await User.findById(id);
        const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
        if (alreadyAdded) {
            let user = await User.findByIdAndUpdate(id, {
                $pull: { wishlist: prodId },
            },
                {
                    new: true
                }
            )
            res.status(400).json({ message: "Product already added to wishlist", user });
        } else {
            let user = await User.findByIdAndUpdate(id, {
                $push: { wishlist: prodId },
            },
                {
                    new: true
                }
            )
            res.status(400).json({ message: "Product added to wishlist", user });
        }
    }
    catch (error) {
        throw new Error(error);
    }

});

// Rating

const rating = asyncHandler(async (req, res) => {
    const { id } = req.user; // Logged-in user's ID
    const { star, prodId, comment } = req.body; // Star rating and product ID

    try {
        const product = await Product.findById(prodId); // Fetch the product

        // Check if the user has already rated the product
        let alreadyRated = product.ratings.find(
            (userId) => userId.postedBy.toString() === id.toString()
        );

        if (alreadyRated) {
            // Update the rating if it already exists
            const updateRating = await Product.findOneAndUpdate(
                { _id: prodId, "ratings.postedBy": id },
                { $set: { "ratings.$.star": star, "ratings.$.comment": comment } },
                { new: true }
            );
            // res.json({ message: "Rating updated successfully"});
        } else {
            // Add a new rating if the user hasn't rated yet
            const rateProduct = await Product.findByIdAndUpdate(
                prodId,
                {
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedBy: id,
                        },
                    },
                },
                { new: true }
            );
            // res.json({
            //     message: "Rated Successfully",

            // });
        }

        const getAllRatings = await Product.findById(prodId);
        let totalRating = getAllRatings.ratings.length;
        let sumRating = getAllRatings.ratings.map((item) =>
            item.star).reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(sumRating / totalRating)
        let finalProduct = await Product.findByIdAndUpdate(prodId, {
            totalRating: actualRating
        }, { new: true });
        res.json({ message: "Rating updated successfully", finalProduct });
    } catch (error) {
        throw error; // Pass the original error to the error handler
    }
});



const uploadImages = asyncHandler(async (req, res) => {
    
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;

        for (const file of files) {
            const { path } = file;
            console.log('Uploading file:', path); // Debugging log
            const newPath = await uploader(path);
            urls.push(newPath.url); // Extract URL
         deleteFile(path); // Delete the local file after uploading to Cloudinary
        }
        const images = urls.map((file) => {
            return file;
        })
res.json(images);
    } catch (error) {
        console.error('Error in uploadImages:', error); // Log errors
        throw new Error("Invalid product ID");
    }
});
const deleteImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    try {
        const deleted = (path) => cloudinaryDeleteImg(id, "images");
        res.json({success:"Deleted images"})
    

    } catch (error) {
        console.error('Error in uploadImages:', error); // Log errors
        throw new Error("Invalid product ID");
    }
});

module.exports = { createProduct, getAProduct, getAllProduct, updateProducts, deleteProducts, addToWishlist, rating, uploadImages,deleteImages }