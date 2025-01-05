const express = require("express");
const router = express.Router();
const { createEnquiry, updateEnquiry, getAllEnquiry, getAEnquiry, deleteEnquiry } = require("../controller/enqController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", createEnquiry)
router.get("/", getAllEnquiry)
router.get("/:id", getAEnquiry)
router.put("/:id", authMiddleware, isAdmin, updateEnquiry)
router.delete("/:id", authMiddleware, isAdmin, deleteEnquiry)


module.exports = router;