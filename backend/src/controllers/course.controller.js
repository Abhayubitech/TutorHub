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

async function addSchedule(req, res) {
    try {
        const { course_id, day, start_time, end_time } = req.body;
        
        if (!course_id || !day) {
            return res.status(400).json({ error: "Course ID and Day are required" });
        }
        
        await courseService.addSchedule(req.body);
        res.json({ message: "Schedule added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { createCourse, getAllCourses, addSchedule };