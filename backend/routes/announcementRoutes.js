const express = require("express");
const router = express.Router();

const verifyAdmin = require("../middleware/adminMiddleware");

const {
    createAnnouncement,
    getAnnouncements,
    updateAnnouncement,
    deleteAnnouncement
} = require("../controllers/announcementController");

router.post("/create", verifyAdmin, createAnnouncement);

router.get("/all", verifyAdmin, getAnnouncements);

router.put("/update/:announcementId", verifyAdmin, updateAnnouncement);

router.delete("/delete/:announcementId", verifyAdmin, deleteAnnouncement);

module.exports = router;