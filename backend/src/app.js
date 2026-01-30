const express = require("express");
const app = express();

app.use(express.json());

const userRoutes = require("./routes/user.routes");
const courseRoutes = require("./routes/course.routes");
const studentRoutes = require("./routes/student.routes");
const teacherRoutes = require("./routes/teacher.routes"); 
const adminRoutes = require("./routes/admin.routes");

app.use("/api/user", userRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes); 
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("TutorHub API is running...");
});

module.exports = app;