const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");
const auth = require("../middleware/auth.middleware");

// Public routes (no auth required)
router.get("/courses", studentController.getAllCourses);
router.get("/courses/:courseId", studentController.getCourseDetails);
router.get("/courses/search", studentController.searchCourses);
router.get("/teachers", studentController.getAllTeachers);
router.get("/teachers/:teacherId", studentController.getTeacherDetails);

// Protected routes (auth required)
router.post("/enroll", auth, studentController.requestEnrollment);
router.get("/my-requests", auth, studentController.getMyRequests);
router.get("/my-enrollments", auth, studentController.getMyEnrollments);
router.delete("/requests/:requestId", auth, studentController.cancelRequest);

module.exports = router;
