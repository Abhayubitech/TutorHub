const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");
const verifyToken = require("../middleware/auth.middleware");

router.post("/", verifyToken, courseController.createCourse);
router.get("/", courseController.getAllCourses); // Public reading allowed, or protect if needed
router.get("/my-courses", verifyToken, courseController.getMyCourses);

module.exports = router;
