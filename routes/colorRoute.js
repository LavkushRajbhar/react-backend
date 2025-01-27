const express = require("express");
const router = express.Router();
const { createColor, updateColor, getAllColor, getAColor, deleteColor } = require("../controller/colorController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, isAdmin, createColor)
router.get("/", getAllColor)
router.get("/:id", getAColor)
router.put("/:id", authMiddleware, isAdmin, updateColor)
router.delete("/:id", authMiddleware, isAdmin, deleteColor)


module.exports = router;