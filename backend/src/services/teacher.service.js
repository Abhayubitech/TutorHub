const db = require("../config/db");

async function createTeacherProfile(profileData) {
  const { user_id, qualification, experience_years, bio } = profileData;

  // Check if profile exists
  const [existing] = await db.query("SELECT * FROM teacher_profiles WHERE user_id = ?", [user_id]);
  if (existing.length > 0) {
    throw new Error("Profile already exists");
  }

  const [result] = await db.query(
    "INSERT INTO teacher_profiles (user_id, qualification, experience_years, bio, status) VALUES (?, ?, ?, ?, 'pending')",
    [user_id, qualification, experience_years, bio]
  );
  return { id: result.insertId, ...profileData, status: 'pending' };
}

async function getAllTeachers() {
  const [rows] = await db.query(`
        SELECT u.id, u.name, u.email, tp.qualification, tp.experience_years, tp.bio, tp.status 
        FROM users u 
        JOIN teacher_profiles tp ON u.id = tp.user_id 
        WHERE u.role = 'teacher'
    `);
  return rows;
}

async function getTeacherById(id) {
  const [rows] = await db.query(`
         SELECT u.id, u.name, u.email, tp.qualification, tp.experience_years, tp.bio, tp.status 
        FROM users u 
        JOIN teacher_profiles tp ON u.id = tp.user_id 
        WHERE u.id = ?
    `, [id]);
  return rows[0];
}

async function updateTeacherProfile(userId, data) {
  // Implementation for update
  // ...
}

async function getPendingRequests() {
  const [rows] = await db.query(
    `SELECT tp.id, tp.user_id, u.name, u.email, tp.qualification, tp.experience_years, tp.bio, tp.status
     FROM teacher_profiles tp
     JOIN users u ON tp.user_id = u.id
     WHERE tp.status = 'pending'`
  );
  return rows;
}

module.exports = { createTeacherProfile, getAllTeachers, getTeacherById, updateTeacherProfile, getPendingRequests };
