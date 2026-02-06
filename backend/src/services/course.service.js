const db = require("../config/db");

// Get all courses
async function getAllCourses() {
  try {
    const [courses] = await db.query(
      `SELECT c.*, u.name as teacher_name, COUNT(ce.id) as enrolled_count
       FROM courses c
       JOIN users u ON c.teacher_id = u.id
       LEFT JOIN course_enrollments ce ON c.id = ce.course_id
       WHERE c.end_date >= CURDATE() OR c.end_date IS NULL
       GROUP BY c.id
       ORDER BY c.created_at DESC`
    );

    return courses;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Get course by ID
async function getCourseById(courseId) {
  try {
    const [courses] = await db.query(
      `SELECT c.*, u.name as teacher_name 
       FROM courses c
       JOIN users u ON c.teacher_id = u.id
       WHERE c.id = ?`,
      [courseId]
    );

    return courses.length > 0 ? courses[0] : null;
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  getAllCourses,
  getCourseById,
};
