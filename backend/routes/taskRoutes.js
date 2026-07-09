const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

// Create Task
const { createTask } = require("../controllers/taskController");

router.post("/create", verifyToken, createTask);

const { getTasks } = require("../controllers/taskController");

router.get("/all", verifyToken, getTasks);


const { updateTask } = require("../controllers/taskController");

router.put("/update/:taskId", verifyToken, updateTask);


const { deleteTask } = require("../controllers/taskController");
router.delete("/delete/:taskId", verifyToken, deleteTask);


module.exports = router;