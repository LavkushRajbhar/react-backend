const express = require("express");
const {
    createUser,
    loginUserController,
    getAllUser,
    getAUser,
    deleteAUser,
    updateAUser,
    unblockUser,
    blockUser,
    updatePasswords,
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    getWishlist,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrders,
    updateOrderStatus,
} = require("../controller/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// User Routes
router.post("/register", createUser);
router.post("/login", loginUserController);
router.post("/cart", authMiddleware, userCart);
router.post('/cart/apply-coupon', authMiddleware, applyCoupon)
router.post('/cart/cash-order',authMiddleware, createOrder)
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/password", authMiddleware, updatePasswords);
router.put("/order/update-order/:id", authMiddleware,isAdmin, updateOrderStatus);
router.put("/edit-user", authMiddleware, updateAUser);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getUserCart);
router.get("/get-orders", authMiddleware, getOrders);

// Admin Routes
router.post("/admin-login", loginAdmin);
router.get("/all-users", authMiddleware, isAdmin, getAllUser);
router.get("/:id", authMiddleware, isAdmin, getAUser);
router.delete('/empty-cart', authMiddleware, emptyCart)
router.delete("/:id", authMiddleware, isAdmin, deleteAUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

// Export the router
module.exports = router;
