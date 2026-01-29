const express = require("express");
const userRoutes = require("./routes/user.routes");
// const auth = require("./middleware/auth.middleware");
const teacherRoutes = require("./routes/teacher.routes"); 
const studentRoutes = require('./routes/student.routes')

const app = express();

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);
// app.use("/api/teacher", userRoutes);
// app.use("/api/course", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

module.exports = app;
