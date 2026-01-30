const db = require("../config/db");

async function applyForCourse(student_id, course_id) {
  const [result] = await db.query(
    "INSERT INTO course_requests (student_id, course_id, status) VALUES (?, ?, 'pending')",
    [student_id, course_id]
  );
  return result;
}

async function getStudentRequests(student_id) {
  const [rows] = await db.query(
    `SELECT course_requests.*, courses.subject 
     FROM course_requests 
     JOIN courses ON course_requests.course_id = courses.id 
     WHERE student_id = ?`,
    [student_id]
  );
  return rows;
}


async function createStudentProfile(profileData) {
  const { user_id, grade, school_name, address } = profileData;
  const [result] = await db.query(
    "INSERT INTO student_profiles (user_id, grade, school_name, address) VALUES (?, ?, ?, ?)",
    [user_id, grade, school_name, address]
  );
  return result;
}

async function getStudentProfile(user_id) {
    const [rows] = await db.query("SELECT * FROM student_profiles WHERE user_id = ?", [user_id]);
    return rows[0];
}

module.exports = { 
    applyForCourse, 
    getStudentRequests, 
    createStudentProfile, 
    getStudentProfile 
};
2.