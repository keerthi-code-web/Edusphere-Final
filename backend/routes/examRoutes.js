const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    createExam,
    getExams,
    updateExam,
    deleteExam
} = require("../controllers/examController");

router.post("/create", verifyToken, createExam);
router.get("/all", verifyToken, getExams);
router.put("/update/:examId", verifyToken, updateExam);
router.delete("/delete/:examId", verifyToken, deleteExam);

module.exports = router;