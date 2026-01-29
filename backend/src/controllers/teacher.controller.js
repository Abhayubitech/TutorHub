const teacherService = require("../services/teacher.service");

// Get teacher profile
async function getProfile(req, res) {
  try {
    const teacherId = req.user.id;
    const profile = await teacherService.getTeacherProfile(teacherId);
    res.json({
      success: true,
      profile,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
}

// Create or update teacher profile
async function updateProfile(req, res) {
  try {
    const teacherId = req.user.id;
    const result = await teacherService.updateTeacherProfile(teacherId, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Get all courses
async function getMyCourses(req, res) {
  try {
    const teacherId = req.user.id;
    const courses = await teacherService.getTeacherCourses(teacherId);
    res.json({
      success: true,
      courses,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Create course
async function createCourse(req, res) {
  try {
    const teacherId = req.user.id;
    const result = await teacherService.createCourse(teacherId, req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Update course
async function updateCourse(req, res) {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.id;
    const result = await teacherService.updateCourse(courseId, teacherId, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Delete course
async function deleteCourse(req, res) {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.id;
    const result = await teacherService.deleteCourse(courseId, teacherId);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Add schedule
async function addSchedule(req, res) {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.id;
    const result = await teacherService.addCourseSchedule(courseId, teacherId, req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Get enrollment requests
async function getEnrollmentRequests(req, res) {
  try {
    const teacherId = req.user.id;
    const requests = await teacherService.getEnrollmentRequests(teacherId);
    res.json({
      success: true,
      requests,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Approve/Reject request
async function handleEnrollmentRequest(req, res) {
  try {
    const { requestId } = req.params;
    const { action } = req.body;
    const teacherId = req.user.id;

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be 'approve' or 'reject'",
      });
    }

    const result = await teacherService.handleEnrollmentRequest(
      requestId,
      teacherId,
      action
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Get enrolled students
async function getEnrolledStudents(req, res) {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.id;
    const students = await teacherService.getEnrolledStudents(courseId, teacherId);
    res.json({
      success: true,
      students,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getMyCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  addSchedule,
  getEnrollmentRequests,
  handleEnrollmentRequest,
  getEnrolledStudents,
};
