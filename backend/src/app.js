const express = require("express");
const userRoutes = require("./routes/user.routes");
// const auth = require("./middleware/auth.middleware");

const app = express();

app.use(express.json());

const courseRoutes = require("./routes/course.routes");
const requestRoutes = require("./routes/request.routes");

app.use("/api/user", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/requests", requestRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

module.exports = app;
