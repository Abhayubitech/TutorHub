const express = require("express");
const userRoutes = require("./routes/user.routes");
// const auth = require("./middleware/auth.middleware");
const teacherRoutes = require("./routes/teacher.routes");
const studentRoutes = require('./routes/student.routes')

const app = express();

app.use(express.json());

const courseRoutes = require("./routes/course.routes");
const requestRoutes = require("./routes/request.routes");

app.use("/api/user", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

module.exports = app;
