const express = require("express");
const courseController = require("../controllers/course.controller");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", auth, courseController.createCourse); 

router.get("/", courseController.getAllCourses);


router.post("/schedule", auth, courseController.addSchedule);


module.exports = router;