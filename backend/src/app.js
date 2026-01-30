const express = require("express");
const userRoutes = require("./routes/user.routes");
const courseRoutes = require("./routes/course.routes");
const cors = require("cors");
// const auth = require("./middleware/auth.middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/Tutor_hub", courseRoutes);
app.use("/api/auth", userRoutes);
// app.use("/api/student", userRoutes);
// app.use("/api/teacher", userRoutes);
// app.use("/api/course", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

module.exports = app;
