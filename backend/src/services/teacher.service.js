const db = require("../config/db");

async function createTeacherProfile(profileData) {
  const { user_id, qualification, experience_years, bio } = profileData;
  
  const [result] = await db.query(
    "INSERT INTO teacher_profiles (user_id, qualification, experience_years, bio) VALUES (?, ?, ?, ?)",
    [user_id, qualification, experience_years, bio]
  );
  return result;
}

async function updateRequestStatus(requestId, status) {
  await db.query(
    "UPDATE course_requests SET status = ? WHERE id = ?",
    [status, requestId]
  );

  if (status === 'approved') {
    
    const [requestData] = await db.query("SELECT student_id, course_id FROM course_requests WHERE id = ?", [requestId]);
    
    if (requestData.length > 0) {
       const { student_id, course_id } = requestData[0];
       
       await db.query(
         "INSERT INTO course_enrollments (student_id, course_id) VALUES (?, ?)",
         [student_id, course_id]
       );
    }
  }
  
  return { message: "Status updated" };
}

async function getMyStudents(teacher_id) {
    const sql = `
        SELECT users.name as student_name, courses.subject, course_requests.status 
        FROM course_requests
        JOIN courses ON course_requests.course_id = courses.id
        JOIN users ON course_requests.student_id = users.id
        WHERE courses.teacher_id = ?
    `;
    const [rows] = await db.query(sql, [teacher_id]);
    return rows;
}

module.exports = { 
    createTeacherProfile, 
    updateRequestStatus,
    getMyStudents 
};