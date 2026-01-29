const express = require("express");
const userRoutes = require("./routes/user.routes");
const courseRoutes = require("./routes/course.routes");
const studentRoutes = require("./routes/student.routes");

const app = express();

app.use(express.json());

// Routes Connection
app.use("/api/user", userRoutes);       
app.use("/api/course", courseRoutes);   
app.use("/api/student", studentRoutes); 

app.get("/", (req, res) => {
  res.send("API is running");
});

module.exports = app;