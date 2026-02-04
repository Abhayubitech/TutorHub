const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacher.controller');
// const authMiddleware = require('../middleware/auth'); // Optional: Add JWT protection

// Prefix: /api/teacher (Defined in server.js)

// Route: GET /api/teacher/courses/:teacherId
router.get('/courses/:teacherId', teacherController.getTeacherCourses);

// Route: GET /api/teacher/requests/:teacherId
router.get('/requests/:teacherId', teacherController.getTeacherRequests);

// Route: PUT /api/teacher/requests/:requestId
// Body: { "status": "approved" } OR { "status": "rejected" }
router.put('/requests/:requestId', teacherController.updateRequestStatus);

router.post('/create-course', teacherController.createCourse);

router.put('/update-course/:id', teacherController.updateCourse);


// ✅ NEW: Update Route (PUT /api/courses/:id)
// router.put('/:id', courseController.updateCourse);

// PUT /api/requests/:id/status
// router.put('/:id/status', teacherController.updateRequestStatus);

module.exports = router;