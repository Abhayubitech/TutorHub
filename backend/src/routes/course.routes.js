const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const courseController = require("../controllers/course.controller");
const verifyToken = require("../middleware/auth.middleware");

router.post("/", verifyToken, courseController.createCourse);
router.get("/", courseController.getAllCourses); // Public reading allowed, or protect if needed
router.get("/my-courses", verifyToken, courseController.getMyCourses);

module.exports = router;
=======

router.get('/pending-requests', teacherController.getPendingRequests);


module.exports = router;
>>>>>>> eb339c897f2663591bebe8c550821a93838d661a
