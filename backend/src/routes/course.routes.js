const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Public routes
router.get("/", courseController.getAllCourses);

// WhatsApp group routes (protected)
router.post("/whatsapp-group", authMiddleware, courseController.createWhatsAppGroup);
router.get("/whatsapp-group/:courseId", authMiddleware, courseController.getWhatsAppGroup);
router.get("/whatsapp-groups/:courseId", authMiddleware, courseController.getAllWhatsAppGroups);
router.put("/whatsapp-groups/:courseId/:groupType", authMiddleware, courseController.updateWhatsAppGroup);
router.post("/whatsapp-group/add-student", authMiddleware, courseController.addStudentToGroup);
router.post("/whatsapp-group/send-zoom", authMiddleware, courseController.sendZoomLink);
router.post("/whatsapp-group/send-payment", authMiddleware, courseController.sendPaymentInfo);

// Payment verification routes (protected)
router.post("/payment/upload", authMiddleware, courseController.upload.single('screenshot'), courseController.uploadPaymentScreenshot);
router.get("/payment/verifications/:courseId", authMiddleware, courseController.getPaymentVerifications);
router.put("/payment/verify/:verificationId", authMiddleware, courseController.updatePaymentVerification);
router.get("/payment/status/:courseId", authMiddleware, courseController.getStudentPaymentStatus);

module.exports = router;
