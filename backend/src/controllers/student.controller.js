const studentService = require('../services/student.service');

exports.getMyEnrollments = async (req, res) => {
  try {
    const studentId = req.user.id;
    const result = await studentService.getMyEnrollments(studentId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const studentId = req.user.id;
    const result = await studentService.getMyRequests(studentId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCourseSchedule = async (req, res) => {
  try {
    const result = await studentService.getCourseSchedule(
      req.params.courseId
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
