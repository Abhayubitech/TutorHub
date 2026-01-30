const db = require("../config/db");

async function createCourse(courseData) {
  const { teacher_id, subject, description, fee, mode, start_date, end_date } = courseData;
  
  const [result] = await db.query(
    "INSERT INTO courses (teacher_id, subject, description, fee, mode, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [teacher_id, subject, description, fee, mode, start_date, end_date]
  );
  return result;
}

async function getAllCourses() {
  const [rows] = await db.query(`
    SELECT courses.*, users.name as teacher_name 
    FROM courses 
    JOIN users ON courses.teacher_id = users.id
  `);
  return rows;
}

async function addSchedule(scheduleData) {
    const { course_id, day, start_time, end_time } = scheduleData;
    const [result] = await db.query(
        "INSERT INTO course_schedules (course_id, day, start_time, end_time) VALUES (?, ?, ?, ?)",
        [course_id, day, start_time, end_time]
    );
    return result;
}

module.exports = { createCourse, getAllCourses, addSchedule };