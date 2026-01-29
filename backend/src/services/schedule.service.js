const db = require('../config/db');

exports.addSchedule = async (data) => {
  const { course_id, day, start_time, end_time } = data;

  await db.query(
    `INSERT INTO course_schedules 
     (course_id, day, start_time, end_time)
     VALUES (?, ?, ?, ?)`,
    [course_id, day, start_time, end_time]
  );

  return { message: 'Schedule added successfully' };
};

exports.getSchedulesByCourse = async (courseId) => {
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
