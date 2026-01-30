const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const teacherRoutes = require("./routes/teacher.routes");
const studentRoutes = require("./routes/student.routes");
const courseRoutes = require("./routes/course.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "TutorHub API is running" });
});

module.exports = app;
