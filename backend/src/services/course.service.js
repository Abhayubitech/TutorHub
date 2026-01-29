const db = require("../config/db");

async function createCourse(courseData) {
    const { teacher_id, subject, description, fee, mode, start_date, end_date } = courseData;

    const [result] = await db.query(
        "INSERT INTO courses (teacher_id, subject, description, fee, mode, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [teacher_id, subject, description, fee, mode, start_date, end_date]
    );

    return { id: result.insertId, ...courseData };
}

async function getAllCourses(filters = {}) {
    let query = "SELECT c.*, u.name as teacher_name FROM courses c JOIN users u ON c.teacher_id = u.id";
    const params = [];

    // Basic filtering if needed in future

    const [rows] = await db.query(query, params);
    return rows;
}

async function getCourseById(id) {
    const [rows] = await db.query("SELECT c.*, u.name as teacher_name FROM courses c JOIN users u ON c.teacher_id = u.id WHERE c.id = ?", [id]);
    return rows[0];
}

async function getCoursesByTeacher(teacherId) {
    const [rows] = await db.query("SELECT * FROM courses WHERE teacher_id = ?", [teacherId]);
    return rows;
}

module.exports = { createCourse, getAllCourses, getCourseById, getCoursesByTeacher };
