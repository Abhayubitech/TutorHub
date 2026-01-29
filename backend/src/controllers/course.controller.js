const courseService = require("../services/course.service");

async function createCourse(req, res) {
  try {
    const courseData = req.body;
    if(!courseData.teacher_id) {
        return res.status(400).json({ error: "Teacher ID is required" });
    }
    const result = await courseService.createCourse(courseData);
    res.json({ message: "Course created successfully", courseId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAllCourses(req, res) {
  try {
    const courses = await courseService.getAllCourses();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createCourse, getAllCourses };