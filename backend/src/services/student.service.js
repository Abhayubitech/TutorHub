const db = require('../config/db');

exports.getMyEnrollments = async (studentId) => {
  const [rows] = await db.query(
    `SELECT 
        c.id AS course_id,
        c.subject,
        c.mode,
        c.fee,
        u.name AS teacher_name,
        ce.enrolled_at
     FROM course_enrollments ce
     JOIN courses c ON ce.course_id = c.id
     JOIN users u ON c.teacher_id = u.id
     WHERE ce.student_id = ?`,
    [studentId]
  );
  return rows;
};

exports.getMyRequests = async (studentId) => {
  const [rows] = await db.query(
    `SELECT 
        c.subject,
        cr.status,
        cr.request_date
     FROM course_requests cr
     JOIN courses c ON cr.course_id = c.id
     WHERE cr.student_id = ?`,
    [studentId]
  );
  return rows;
};

exports.getCourseSchedule = async (courseId) => {
  const [rows] = await db.query(
    `SELECT day, start_time, end_time
     FROM course_schedules
     WHERE course_id = ?
     ORDER BY FIELD(day,
      'Monday','Tuesday','Wednesday',
      'Thursday','Friday','Saturday','Sunday')`,
    [courseId]
  );
  return rows;
};
