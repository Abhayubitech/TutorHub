const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Public routes
router.get("/", courseController.getAllCourses);

// WhatsApp group routes (protected)
router.post("/whatsapp-group", authMiddleware, courseController.createWhatsAppGroup);
router.get("/whatsapp-group/:courseId", authMiddleware, courseController.getWhatsAppGroup);
router.post("/whatsapp-group/add-student", authMiddleware, courseController.addStudentToGroup);
router.post("/whatsapp-group/send-zoom", authMiddleware, courseController.sendZoomLink);
router.post("/whatsapp-group/send-payment", authMiddleware, courseController.sendPaymentInfo);

module.exports = router;
