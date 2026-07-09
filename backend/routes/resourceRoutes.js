const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    createResource,
    getResources,
    updateResource,
    deleteResource
} = require("../controllers/resourceController");


router.post("/create", verifyToken, createResource);
router.get("/all", verifyToken, getResources);
router.put("/update/:resourceId", verifyToken, updateResource);
router.delete("/delete/:resourceId", verifyToken, deleteResource);

module.exports = router;