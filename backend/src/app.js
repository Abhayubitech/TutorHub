const express = require("express");
const app = express();
const cors = require("cors"); 
const path = require("path"); 
const userRoutes = require("./routes/user.routes");
const courseRoutes = require("./routes/course.routes");
const studentRoutes = require("./routes/student.routes");
const teacherRoutes = require("./routes/teacher.routes"); 
const adminRoutes = require("./routes/admin.routes");


app.use(cors());

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use("/api/user", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes); 
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("TutorHub API is running...");
});

module.exports = app;