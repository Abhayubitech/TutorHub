const db = require("../config/db");
const userService = require("./user.service");

async function getUsers(role) {
  try {
    const params = [];
    let sql = "SELECT id, name, email, role, phone, created_at FROM users";

    if (role) {
      sql += " WHERE role = ?";
      params.push(role);
    }

    sql += " ORDER BY created_at DESC";

    const [users] = await db.query(sql, params);
    return users;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getRecentUsers(limit = 10) {
  try {
    const safeLimit = Number.isFinite(Number(limit)) ? Math.max(1, Math.min(100, Number(limit))) : 10;
    const [users] = await db.query(
      "SELECT id, name, email, role, phone, created_at FROM users ORDER BY created_at DESC LIMIT ?",
      [safeLimit]
    );
    return users;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function updateUser(userId, userData) {
  return userService.updateUser(userId, userData);
}

async function deleteUser(userId) {
  return userService.deleteUser(userId);
}

async function getAllCourses() {
  try {
    const [courses] = await db.query(
      `SELECT c.*, u.name as teacher_name, u.email as teacher_email
       FROM courses c
       JOIN users u ON c.teacher_id = u.id
       ORDER BY c.created_at DESC`
    );
    return courses;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getTeacherCourseMappings() {
  try {
    const [rows] = await db.query(
      `SELECT u.id as teacher_id, u.name as teacher_name, u.email as teacher_email,
              c.id as course_id, c.subject, c.description, c.fee, c.mode, c.start_date, c.end_date
       FROM users u
       LEFT JOIN courses c ON c.teacher_id = u.id
       WHERE u.role = 'teacher'
       ORDER BY u.name ASC, c.created_at DESC`
    );
    return rows;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getStudentEnrollmentMappings() {
  try {
    const [rows] = await db.query(
      `SELECT u.id as student_id, u.name as student_name, u.email as student_email,
              c.id as course_id, c.subject, c.mode, c.fee,
              tu.id as teacher_id, tu.name as teacher_name,
              ce.enrolled_at
       FROM users u
       LEFT JOIN course_enrollments ce ON ce.student_id = u.id
       LEFT JOIN courses c ON c.id = ce.course_id
       LEFT JOIN users tu ON tu.id = c.teacher_id
       WHERE u.role = 'student'
       ORDER BY u.name ASC, ce.enrolled_at DESC`
    );
    return rows;
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  getUsers,
  getRecentUsers,
  updateUser,
  deleteUser,
  getAllCourses,
  getTeacherCourseMappings,
  getStudentEnrollmentMappings,
};
