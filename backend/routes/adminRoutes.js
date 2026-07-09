const express = require("express");
const router = express.Router();

const {
    createAdmin,
    loginAdmin,
    getAdmins,
    updateAdmin,
    deleteAdmin,
    getAllFeedback
} = require("../controllers/adminController");


router.post("/create", createAdmin);
router.post("/login", loginAdmin);
router.get("/all", getAdmins);
router.put("/update/:adminId", updateAdmin);
router.delete("/delete/:adminId", deleteAdmin);
router.get("/feedback", getAllFeedback);


module.exports = router;

