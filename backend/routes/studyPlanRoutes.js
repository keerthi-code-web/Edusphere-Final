const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    createStudyPlan,
    getStudyPlans,
    updateStudyPlan,
    deleteStudyPlan
} = require("../controllers/studyPlanController");

router.post("/create", verifyToken, createStudyPlan);
router.get("/all", verifyToken, getStudyPlans);
router.put("/update/:planId", verifyToken, updateStudyPlan);
router.delete("/delete/:planId", verifyToken, deleteStudyPlan);

module.exports = router;