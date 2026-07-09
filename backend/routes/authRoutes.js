const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
    register,
    login,
    getCurrentStudent,
    completeOnboarding,
    updateProfile,
    uploadProfilePhoto
} = require("../controllers/authController");
router.post("/register", register);

router.post("/login", login);

router.get("/me", verifyToken, getCurrentStudent);

router.put("/onboarding", completeOnboarding);

router.put("/profile", verifyToken, updateProfile);

router.post(
    "/upload-photo",
    verifyToken,
    upload.single("profile_photo"),
    uploadProfilePhoto
);

module.exports = router;