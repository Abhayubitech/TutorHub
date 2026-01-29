const db = require('../config/db');

exports.getMyCourses = async (teacherId) => {
  const [rows] = await db.query(
    `SELECT id, subject, fee, mode, start_date, end_date
     FROM courses
     WHERE teacher_id = ?`,
    [teacherId]
  );
  return rows;
};

exports.getPendingRequests = async (teacherId) => {
  const [rows] = await db.query(
    `SELECT 
        cr.id AS request_id,
        u.name AS student_name,
        u.email,
        c.subject
     FROM course_requests cr
     JOIN courses c ON cr.course_id = c.id
     JOIN users u ON cr.student_id = u.id
     WHERE c.teacher_id = ?
       AND cr.status = 'pending'`,
    [teacherId]
  );
  return rows;
};

exports.getEnrolledStudents = async (courseId) => {
  const [rows] = await db.query(
    `SELECT 
        u.id,
        u.name,
        u.email,
        ce.enrolled_at
     FROM course_enrollments ce
     JOIN users u ON ce.student_id = u.id
     WHERE ce.course_id = ?`,
    [courseId]
  );
  return rows;
};
