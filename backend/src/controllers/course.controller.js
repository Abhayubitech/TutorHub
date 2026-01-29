const courseService = require("../services/course.service");

// Get all courses
async function getAllCourses(req, res) {
  try {
    const courses = await courseService.getAllCourses();
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

module.exports = {
  getAllCourses,
};
