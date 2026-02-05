const db = require("../config/db");

async function createTeacherProfile(profileData) {
  const { user_id, name, email, phone, bio, qualifications, experience, address, profile_pic } = profileData;

  await db.query(
    "UPDATE users SET name=?, email=?, phone=? WHERE id=?",
    [name, email, phone, user_id]
  );
  

  const [existing] = await db.query("SELECT * FROM teacher_profiles WHERE user_id = ?", [user_id]);

  if (existing.length > 0) {
    
    let sql = `UPDATE teacher_profiles SET bio=?, qualifications=?, experience=?, address=?`;
    let params = [bio, qualifications, experience, address];

    if (profile_pic) {
        sql += `, profile_pic=?`;
        params.push(profile_pic);
    }

    sql += ` WHERE user_id=?`;
    params.push(user_id);

    const [result] = await db.query(sql, params);
    return result;

  } else {
    
    const [result] = await db.query(
      "INSERT INTO teacher_profiles (user_id, bio, qualifications, experience, address, profile_pic) VALUES (?, ?, ?, ?, ?, ?)",
      [user_id, bio, qualifications, experience, address, profile_pic]
    );
    return result;
  }
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
       
       
       const [existing] = await db.query("SELECT * FROM course_enrollments WHERE student_id=? AND course_id=?", [student_id, course_id]);
       
       if (existing.length === 0) {
           await db.query(
             "INSERT INTO course_enrollments (student_id, course_id) VALUES (?, ?)",
             [student_id, course_id]
           );
       }
    }
  }
  return { message: "Status updated" };
}

async function getMyStudents(teacher_id) {
    const sql = `
        SELECT users.name as student_name, users.email, users.phone, courses.subject, course_requests.status 
        FROM course_requests
        JOIN courses ON course_requests.course_id = courses.id
        JOIN users ON course_requests.student_id = users.id
        WHERE courses.teacher_id = ?
    `;
    const [rows] = await db.query(sql, [teacher_id]);
    return rows;
}

async function getTeacherProfileData(user_id) {
  const sql = `
    SELECT users.name, users.email, users.phone, users.role, 
           teacher_profiles.bio, teacher_profiles.qualifications, teacher_profiles.experience, 
           teacher_profiles.address, teacher_profiles.profile_pic 
    FROM users 
    LEFT JOIN teacher_profiles ON users.id = teacher_profiles.user_id 
    WHERE users.id = ?
  `;
  const [rows] = await db.query(sql, [user_id]);
  return rows[0]; 
}

module.exports = { 
    createTeacherProfile, 
    updateRequestStatus, 
    getMyStudents,
    getTeacherProfileData 
};