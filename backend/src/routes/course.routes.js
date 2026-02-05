const express = require("express");
const courseController = require("../controllers/course.controller");
const auth = require("../middleware/auth.middleware");

const router = express.Router();


router.post("/", auth, courseController.createCourse);
router.get("/", courseController.getAllCourses);
router.post("/enroll", auth, courseController.enroll);

router.get("/requests/teacher/:teacherId", auth, courseController.getTeacherRequests);

router.post("/requests/status", auth, courseController.updateRequestStatus);

router.delete("/:id", auth, courseController.deleteCourse);

router.get("/requests/student/:studentId", auth, courseController.getStudentRequests);

router.get("/:courseId/students", auth, courseController.getEnrolledStudents);

router.get("/:id", auth, courseController.getCourseById); 
router.put("/:id", auth, courseController.updateCourse);  
module.exports = router;