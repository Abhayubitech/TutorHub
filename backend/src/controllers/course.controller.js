<<<<<<< HEAD
const courseService = require("../services/course.service");

async function createCourse(req, res) {
    try {
        const courseData = { ...req.body, teacher_id: req.user.id };

        // Validate role
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ error: "Only teachers can create courses" });
        }

        const course = await courseService.createCourse(courseData);
        res.json(course);
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

async function getMyCourses(req, res) {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ error: "Only available for teachers" });
        }
        const courses = await courseService.getCoursesByTeacher(req.user.id);
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { createCourse, getAllCourses, getMyCourses };
=======
exports.getPendingRequests = async (req, res) => {
  try {
    const data = await teacherService.getPendingRequests();

    res.status(200).json({
      pendingRequests: data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
>>>>>>> eb339c897f2663591bebe8c550821a93838d661a
