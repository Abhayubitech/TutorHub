const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacher.controller");
const auth = require("../middleware/auth.middleware");

// All routes require authentication
router.use(auth);

// Profile routes
router.get("/profile", teacherController.getProfile);
router.put("/profile", teacherController.updateProfile);

// Course routes
router.get("/courses", teacherController.getMyCourses);
router.get("/courses/:courseId", teacherController.getCourseById);
router.post("/courses", teacherController.createCourse);
router.put("/courses/:courseId", teacherController.updateCourse);
router.delete("/courses/:courseId", teacherController.deleteCourse);

// Schedule routes
router.post("/courses/:courseId/schedule", teacherController.addSchedule);

// Enrollment request routes
router.get("/enrollment-requests", teacherController.getEnrollmentRequests);
router.put("/enrollment-requests/:requestId", teacherController.handleEnrollmentRequest);

// Enrolled students route
router.get("/courses/:courseId/students", teacherController.getEnrolledStudents);

// WhatsApp group routes
router.post("/whatsapp/groups", teacherController.createWhatsAppGroup);
router.get("/whatsapp/groups/:courseId", teacherController.getWhatsAppGroups);
router.put("/whatsapp/groups/:courseId", teacherController.updateWhatsAppGroup);

// Payment verification routes
router.get("/payment-verifications/:courseId", teacherController.getPaymentVerifications);
router.put("/payment-verifications/:verificationId", teacherController.updatePaymentVerification);
router.get("/enrolled-students/:courseId", teacherController.loadEnrolledStudents);

module.exports = router;
