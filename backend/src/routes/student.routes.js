const express = require('express');
const router = express.Router();

const studentController = require('../controllers/student.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/auth.middleware');

router.use(verifyToken, allowRoles('student'));

router.get('/enrollments', studentController.getMyEnrollments);
router.get('/requests', studentController.getMyRequests);
router.get('/schedule/:courseId', studentController.getCourseSchedule);

module.exports = router;
