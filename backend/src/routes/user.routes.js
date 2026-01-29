const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  createCourse,
  requestCourse,
  approveRequest,
  rejectRequest,
  getAllCourses,
  updateCourse,
  deleteCourse
} = require('../controllers/user.controller');

const { verifyToken, allowRoles } = require('../middleware/auth.middleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.post(
  '/course',
  verifyToken,
  allowRoles('teacher'),
  createCourse
);

router.get('/courses', getAllCourses);

router.post(
  '/course-request',
  verifyToken,
  allowRoles('student'),
  requestCourse
);

router.put(
  '/approve-request',
  verifyToken,
  allowRoles('teacher'),
  approveRequest
);

router.put(
  '/reject-request',
  verifyToken,
  allowRoles('teacher'),
  rejectRequest
);

router.put(
  '/course/:courseId',
  verifyToken,
  allowRoles('teacher'),
  updateCourse
);

router.delete(
  '/course/:courseId',
  verifyToken,
  allowRoles('teacher'),
  deleteCourse
);

module.exports = router;
