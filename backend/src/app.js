const express = require("express");
const userRoutes = require("./routes/user.routes");
// const auth = require("./middleware/auth.middleware");

const app = express();

app.use(express.json());

app.use("/api/user", userRoutes);
// app.use("/api/student", userRoutes);
// app.use("/api/teacher", userRoutes);
// app.use("/api/course", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

module.exports = app;
