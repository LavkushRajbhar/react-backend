const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const asyncHandler = require('express-async-handler');
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongodbId");
const crypto = require("crypto");
const sendEmail = require("./emailController");
const uniqid = require('uniqid')
const createUser = asyncHandler(async (req, res) => {
    try {
        const email = req.body.email;
        const findUser = await User.findOne({ email: email });

        if (!findUser) {
            const newUser = await User.create(req.body); // Save the new user to the database
            res.status(201).json({
                message: "User created successfully",
                success: true,
                user: newUser, // Include the created user details if needed
            });
        } else {
            throw new Error("User Already Exists")
        }
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            success: false,
            error: error.message,
        });
    }
});


const loginUserController = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // check user is exist or not
    const findUser = await User.findOne({ email });
    if (findUser && await findUser.isPasswordMatched(password)) {
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?.id),
            success: true,
            message: "User logged in successfully",
        });
    } else {
        throw new Error("Invalid Credentials")
    }
})

//admin login
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // check user is exist or not
    const findAdmin = await User.findOne({ email });

    if (!findAdmin) {
        throw new Error("User not found");
    }

    if (findAdmin.role !== "admin") {
        throw new Error("Not authorized user");
    }

    if (findAdmin && await findAdmin.isPasswordMatched(password)) {
        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?.id),
            success: true,
            message: "User logged in successfully",
        });
    } else {
        throw new Error("Invalid Credentials")
    }
})

//update a user

const updateAUser = asyncHandler(async (req, res) => {

    const { _id } = req.user;
    try {
        const updateAuser = await User.findByIdAndUpdate(_id, {
            firstname: req?.body.firstname,
            lastname: req?.body.lastname,
            email: req?.body.email,
            mobile: req?.body.mobile,
        }, {
            new: true
        }
        );
        res.json(updateAuser)
    } catch (error) {
        throw new Error(error);
    }
});

//get All users

const getAllUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json({
            success: true,
            users: getUsers,
        });
    } catch (error) {
        throw new Error(error)
    }
});

// get a single user

const getAUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id); // Validate the user ID is a valid MongoDB ID before proceeding
    try {
        const getaUser = await User.findById(id);
        res.json({
            getaUser,
        })
    } catch (error) {
        throw new Error(error);
    }
})

// delete a single user

const deleteAUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id); // Validate the user ID is a valid MongoDB ID before proceeding
    try {
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({
            deleteaUser,
        })
    } catch (error) {
        throw new Error(error);
    }
});

const blockUser = asyncHandler(async (req, res) => {

    const { id } = req.params;
    validateMongoDbId(id); // Validate the user ID is a valid MongoDB ID before proceeding
    try {
        const block = await User.findByIdAndUpdate(id, {

            isBlocked: true,
        }, {
            new: true,
        });
        res.json({
            message: "User Blocked"
        })
    } catch (error) {
        throw new Error(error);
    }
});



const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id); // Validate the user ID is a valid MongoDB ID before proceeding
    try {
        const unblock = await User.findByIdAndUpdate(id, {

            isBlocked: false,
        }, {
            new: true,
        });
        res.json({
            message: "User UnBlocked"
        })
    } catch (error) {
        throw new Error(error);
    }

});

/// update password

const updatePasswords = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatePassword = await user.save();
        res.json({
            message: "Password updated successfully",
            success: true,
            user: updatePassword,
        });
    } else {
        res.json(user)
    }

})

// forgot password

const forgotPasswordToken = asyncHandler(async (req, res) => {

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User not Found with this email");
    }
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetUrl = `Hi, Please follow this link to reset your password. This link is valid till 10 minutes now. <a href="http://localhost:5000/api/user/reset-password/${token}">Click Here</a>`
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            htm: resetUrl,

        }
        sendEmail(data);
        res.json(token)
    } catch (error) {

        throw new Error(error);
    }
});

//reset password

const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetTokenExpiresAt: { $gt: Date.now() } });

    if (!user) {
        throw new Error("Password reset token is invalid or expired.Please try again later.");
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresAt = undefined;
    await user.save();
    res.json({
        message: "Password reset successfully",
        success: true,
    });

});

// const handleRefreshToken = asyncHandler(async (req, res) => {
//     const cookie = req.cookies;
//     if (!cookie?.refreshToken) {
//         throw new Error("No refresh token provided.");
//     }
//     const refreshToken = cookie.refreshToken;
//     const user = await User.findOne({ refreshToken });
//     if (!user) {
//         throw new Error("Invalid refresh token.");
//     }
//     jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
//         if (err || user.id !== decoded.id) {
//             throw new Error("Invalid refresh token.");
//         }
//         const accessToken = generateToken(user?.id);
//         res.json({ accessToken });
//     })

// });

// const logout = asyncHandler(async (req, res) => {
//     const cookie = req.cookies;
//     if (!cookie?.refreshToken) {
//         throw new Error('You must provide a refresh token');
//     }
//     const refreshToken = cookie.refreshToken;
//     const user = await User.findOne({ refreshToken });
//     if (!user) {
//         throw new Error("Invalid refresh token.");
//     }
//     user.refreshToken = undefined;
//     await user.save();
//     res.clearCookie('refreshToken', { path: '/api/auth/refresh-token' });
//     res.json({ message: 'Logged out successfully' });


// })

const getWishlist = asyncHandler(async (req, res) => {
    const { _id, } = req.user;
    try {

        const findUser = await User.findById(_id).populate("wishlist");
        res.json(findUser?.wishlist)
    }
    catch (error) {
        throw new Error(error)
    }

});


const userCart = asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const { _id } = req.user;


    validateMongoDbId(_id);
    try {
        let products = [];
        const user = await User.findById(_id);
        //check if user is already have product in cart

        const alreadyExistCart = await Cart.findOne({ orderBy: user._id });
        if (alreadyExistCart) {
            alreadyExistCart.remove();
        }
        for (let i = 0; i < cart.length; i++) {
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById(cart[i]._id).select('price').exec();
            object.price = getPrice.price;
            products.push(object);
        }
        let cartTotal = 0;
        for (let i = 0; i < products.length; i++) {
            cartTotal += products[i].price * products[i].count;
        }
        console.log(products, cartTotal);
        let newCart = await new Cart({
            products,
            cartTotal,
            orderBy: user?.id,
        }).save();
        res.json(newCart);
    }
    catch (error) {

        throw new Error(error);
    }

});

const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const cart = await Cart.findOne({ orderBy: _id }).populate("products.product");
        res.json(cart);

    }
    catch (error) {
        throw new Error(error);

    }
});

const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const user = await User.findOne({ _id })
        const cart = await Cart.findOneAndDelete({ orderBy: user._id });
        res.json(cart);

    }
    catch (error) {
        throw new Error(error);

    }

});

const applyCoupon = asyncHandler(async (req, res) => {
    const { coupon } = req.body;
    const { _id } = req.user;

    // Validate the user's MongoDB ID
    validateMongoDbId(_id);

    // Validate that a coupon is provided
    if (!coupon) {
        return res.status(400).json({ message: "Coupon is required" });
    }

    // Find the coupon in the database
    const validCoupon = await Coupon.findOne({ name: coupon });
    if (!validCoupon) {
        return res.status(404).json({ message: "Coupon not found or invalid" });
    }

    // Find the user's cart
    const user = await User.findById(_id); // Use findById for clarity
    const cart = await Cart.findOne({ orderBy: user._id }).populate("products.product");

    if (!cart) {
        return res.status(404).json({ message: "Please add some items to apply the coupons" });
    }

    const { products, cartTotal } = cart;

    // Calculate the discount
    const totalAfterDiscount = Number((cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2));

    // Update the cart with the discount
    const updatedCart = await Cart.findOneAndUpdate(
        { orderBy: user._id },
        { totalAfterDiscount },
        { new: true } // Return the updated document
    );

    // Respond with success and updated total
    res.json({
        message: "Coupon applied successfully",
        totalAfterDiscount,
        cart: updatedCart,
    });
});

const createOrder = asyncHandler(async (req, res) => {
    const { COD, couponApplied } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);
    if (!COD) {
        throw new Error("Create Cash Order failed");
    }
    try {
        const user = await User.findById(_id);
        let userCart = await Cart.findOne({
            orderBy: user._id
        });
        if (!userCart) {
            throw new Error("Please Add Items to Cart");
        }
        let finalAmount = 0;
        if (couponApplied && userCart.totalAfterDiscount) {
            finalAmount = userCart.totalAfterDiscount;
        }
        else {
            finalAmount = userCart.cartTotal;
        }
        let newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: "COD",
                amount: finalAmount,
                status: "Cash on Delivery",
                created: Date.now(),
                currency: "USD"
            },
            orderBy: user.id,
            orderStatus: "Cash on Delivery"
        }).save();
        let update = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } },
                    // upsert: true,
                }
            };
        });
        const updated = await Product.bulkWrite(update, {});
        res.json({ success: true, })
    }
    catch (error) {
        throw new Error(error);
    }

});

const getOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);

    try {
        const userOrders = await Order.findOne({ orderBy: _id }).populate('products.product')
        res.json(userOrders);
    }
    catch (error) {
        throw new Error(error);
    }
    
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const findOrder = await Order.findByIdAndUpdate(id, { orderStatus: status, paymentIntent: { status: status }, }, { new: true });
        if (!findOrder) {
            throw new Error('Order not found');
        }
        res.json(findOrder);
    }
    catch (error) {
        throw new Error(error);
    }

})

module.exports = { createUser, loginUserController, loginAdmin, getAllUser, getAUser, deleteAUser, updateAUser, blockUser, unblockUser, updatePasswords, forgotPasswordToken, resetPassword, getWishlist, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders, updateOrderStatus};
