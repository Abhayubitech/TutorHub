const express = require('express');
const router = express.Router();

const teacherController = require('../controllers/teacher.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/auth.middleware');

router.use(verifyToken, allowRoles('teacher'));

router.get('/courses', teacherController.getMyCourses);
router.get('/requests/pending', teacherController.getPendingRequests);
router.get('/students/:courseId', teacherController.getEnrolledStudents);

module.exports = router;
