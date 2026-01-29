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
<<<<<<< HEAD
app.use("/api/courses", courseRoutes);
app.use("/api/requests", requestRoutes);
=======
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);
// app.use("/api/teacher", userRoutes);
// app.use("/api/course", userRoutes);
>>>>>>> eb339c897f2663591bebe8c550821a93838d661a

app.get("/", (req, res) => {
  res.send("API is running");
});

module.exports = app;
