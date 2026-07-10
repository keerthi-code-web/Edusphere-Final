
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const studyPlanRoutes = require("./routes/studyPlanRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const examRoutes = require("./routes/examRoutes");
const progressRoutes = require("./routes/progressRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");

const verifyToken = require("./middleware/authMiddleware");

const app = express();

app.use(express.json());

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

app.use(
    cors({
        origin: function (origin, callback) {

            if (!origin) return callback(null, true);

            if (
                origin === "http://localhost:5173" ||
                origin.endsWith(".vercel.app")
            ) {
                return callback(null, true);
            }

            callback(new Error("Not allowed by CORS"));
        },
        credentials: true
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/studyplans", studyPlanRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);


app.post("/test", (req, res) => {
    res.json({
        message: "Test route working!"
    });
});

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    console.log("Root route hit!");
    res.send("Welcome to EduSphere Backend 🚀");
});

app.get("/api/profile", verifyToken, (req, res) => {

    res.status(200).json({
        success: true,
        message: "Protected Route Access Granted!",
        user: req.user
    });

});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

