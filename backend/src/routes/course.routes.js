const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");

// Public routes
router.get("/", courseController.getAllCourses);

module.exports = router;
