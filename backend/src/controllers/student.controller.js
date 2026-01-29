const studentService = require("../services/student.service");

// Get all courses (public)
async function getAllCourses(req, res) {
  try {
    const courses = await studentService.getAllCourses();
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

// Get course details (public)
async function getCourseDetails(req, res) {
  try {
    const { courseId } = req.params;
    const course = await studentService.getCourseDetails(courseId);
    res.json({
      success: true,
      course,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
}

// Search courses (public)
async function searchCourses(req, res) {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters",
      });
    }

    const courses = await studentService.searchCourses(query);
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

// Request enrollment (requires auth)
async function requestEnrollment(req, res) {
  try {
    const studentId = req.user.id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const result = await studentService.requestEnrollment(studentId, courseId);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Get my requests (requires auth)
async function getMyRequests(req, res) {
  try {
    const studentId = req.user.id;
    const requests = await studentService.getMyRequests(studentId);
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

// Get my enrollments (requires auth)
async function getMyEnrollments(req, res) {
  try {
    const studentId = req.user.id;
    const courses = await studentService.getMyEnrollments(studentId);
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

// Cancel request (requires auth)
async function cancelRequest(req, res) {
  try {
    const studentId = req.user.id;
    const { requestId } = req.params;
    const result = await studentService.cancelRequest(requestId, studentId);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Get all teachers (public)
async function getAllTeachers(req, res) {
  try {
    const teachers = await studentService.getAllTeachers();
    res.json({
      success: true,
      teachers,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Get teacher details (public)
async function getTeacherDetails(req, res) {
  try {
    const { teacherId } = req.params;
    const teacher = await studentService.getTeacherDetails(teacherId);
    res.json({
      success: true,
      teacher,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  getAllCourses,
  getCourseDetails,
  searchCourses,
  requestEnrollment,
  getMyRequests,
  getMyEnrollments,
  cancelRequest,
  getAllTeachers,
  getTeacherDetails,
};
