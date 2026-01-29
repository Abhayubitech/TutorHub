const express = require('express');
const router = express.Router();

const scheduleController = require('../controllers/schedule.controller');
const {
  verifyToken,
  allowRoles
} = require('../middleware/auth.middleware');

router.post(
  '/',
  verifyToken,
  allowRoles('teacher'),
  scheduleController.addSchedule
);

router.get('/:courseId', scheduleController.getSchedulesByCourse);

module.exports = router;
