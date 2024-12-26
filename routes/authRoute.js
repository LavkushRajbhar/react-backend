const express = require("express");
const { createUser, loginUserController, getAllUser, getAUser, deleteAUser, updateAUser, unblockUser, blockUser, updatePasswords, forgotPasswordToken,resetPassword } = require("../controller/userController");
let router = express.Router();


const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post('/register', createUser);
router.post('/forgot-password-token', forgotPasswordToken);
router.put('/reset-password/:token', resetPassword);
router.put('/password', authMiddleware, updatePasswords);
router.post('/login', loginUserController);
router.get('/all-users', getAllUser);
router.get("/:id", authMiddleware,isAdmin, getAUser);
router.delete('/:id', deleteAUser);
router.put('/edit-user', authMiddleware, updateAUser);
router.put('/block-user/:id', authMiddleware,isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware,isAdmin, unblockUser);
// router.get('/:id', getAUser);



module.exports = router;