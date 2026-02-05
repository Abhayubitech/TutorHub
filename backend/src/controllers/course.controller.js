const courseService = require("../services/course.service");

async function createCourse(req, res) {
  try {
    const courseData = req.body;
    if(!courseData.teacher_id || !courseData.subject || !courseData.fee) {
        return res.status(400).json({ error: "Required fields missing" });
    }
    const result = await courseService.createCourse(courseData);
    res.json(result);
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

async function enroll(req, res) {
    try {
        const { student_id, course_id } = req.body;
        const result = await courseService.enrollStudent(student_id, course_id);
        res.json({ message: "Application Sent" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


async function getTeacherRequests(req, res) {
    try {
        const { teacherId } = req.params;
        const requests = await courseService.getTeacherRequests(teacherId);
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateRequestStatus(req, res) {
    try {
        const { requestId, status, studentId, courseId } = req.body;
        const result = await courseService.updateRequestStatus(requestId, status, studentId, courseId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function deleteCourse(req, res) {
    try {
        const { id } = req.params;
        const result = await courseService.deleteCourse(id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getStudentRequests(req, res) {
    try {
        const { studentId } = req.params;
        const requests = await courseService.getStudentRequests(studentId);
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


async function getEnrolledStudents(req, res) {
    try {
        const { courseId } = req.params;
        const students = await courseService.getEnrolledStudents(courseId);
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


async function getCourseById(req, res) {
    try {
        const result = await courseService.getCourseById(req.params.id);
        if(!result) return res.status(404).json({error: "Course not found"});
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateCourse(req, res) {
    try {
        const { id } = req.params;
        const result = await courseService.updateCourse(id, req.body);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { 
    createCourse, getAllCourses, enroll, 
    getTeacherRequests, updateRequestStatus, deleteCourse, getStudentRequests, getEnrolledStudents, getCourseById, updateCourse
};