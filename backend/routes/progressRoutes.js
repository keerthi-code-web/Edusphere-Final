const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    createProgress,
    getProgress,
    updateProgress,
    deleteProgress
} = require("../controllers/progressController");


router.post("/create", verifyToken, createProgress);
router.get("/all", verifyToken, getProgress);
router.put("/update/:progressId", verifyToken, updateProgress);
router.delete("/delete/:progressId", verifyToken, deleteProgress);

module.exports = router;