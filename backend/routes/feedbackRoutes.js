const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const {

    createFeedback,
    getFeedback,
    updateFeedback,
    deleteFeedback,
    updateFeedbackStatus,getAllFeedback
} = require("../controllers/feedbackController");

router.post("/create", verifyToken, createFeedback);
router.get("/all", verifyToken, getFeedback);
router.put("/update/:feedbackId", verifyToken, updateFeedback);
router.put(
    "/admin/status/:feedbackId",
    updateFeedbackStatus
);
router.delete("/delete/:feedbackId", verifyToken, deleteFeedback);
router.get("/admin/all", getAllFeedback);

module.exports = router;

