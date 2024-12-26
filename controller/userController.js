const User = require("../models/userModel");
const asyncHandler = require('express-async-handler');
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongodbId");
const crypto = require("crypto");
const sendEmail = require("./emailController");
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

module.exports = { createUser, loginUserController, getAllUser, getAUser, deleteAUser, updateAUser, blockUser, unblockUser, updatePasswords, forgotPasswordToken, resetPassword };
