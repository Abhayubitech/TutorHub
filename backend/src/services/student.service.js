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
  const { user_id, name, email, phone, grade, school_name, address, profile_pic } = profileData;

  await db.query(
    "UPDATE users SET name=?, email=?, phone=? WHERE id=?",
    [name, email, phone, user_id]
  );
  
  const [existing] = await db.query("SELECT * FROM student_profiles WHERE user_id = ?", [user_id]);

  if (existing.length > 0) {

    let sql = `UPDATE student_profiles SET grade=?, school_name=?, address=?`;
    let params = [grade, school_name, address];

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
      "INSERT INTO student_profiles (user_id, grade, school_name, address, profile_pic) VALUES (?, ?, ?, ?, ?)",
      [user_id, grade, school_name, address, profile_pic]
    );
    return result;
  }
}

async function getStudentProfileData(user_id) {
   const sql = `
     SELECT users.name, users.email, users.phone, users.role,
            student_profiles.grade, student_profiles.school_name, 
            student_profiles.address, student_profiles.profile_pic
     FROM users
     LEFT JOIN student_profiles ON users.id = student_profiles.user_id
     WHERE users.id = ?
   `;
   const [rows] = await db.query(sql, [user_id]);
   return rows[0];
}

module.exports = { 
    applyForCourse, 
    getStudentRequests, 
    createStudentProfile, 
    getStudentProfileData 
};