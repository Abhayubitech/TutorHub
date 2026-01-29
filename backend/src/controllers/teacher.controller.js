const teacherService = require('../services/teacher.service')

exports.getMyCourses = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const result = await teacherService.getMyCourses(teacherId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const result = await teacherService.getPendingRequests(teacherId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEnrolledStudents = async (req, res) => {
  try {
    const result = await teacherService.getEnrolledStudents(
      req.params.courseId
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
