let db = require('../config/db');

exports.createTeacherProfile = async ({
  user_id,
  qualification,
  experience_years,
  bio
}) => {

  const [result] = await db.query(
    `INSERT INTO teacher_profiles 
     (user_id, qualification, experience_years, bio)
     VALUES (?, ?, ?, ?)`,
    [user_id, qualification, experience_years, bio]
  );

  return {
    id: result.insertId,
    user_id,
    qualification,
    experience_years,
    bio
  };
};

exports.getAllTeachers = async()=>{
    const [rows]= await db.query(
        `    SELECT 
      tp.id,
      tp.qualification,
      tp.experience_years,
      tp.bio,
      u.name,
      u.email,
      u.phone
    FROM teacher_profiles tp
    JOIN users u ON tp.user_id = u.id`
    ) 
    return rows

}
exports.getTeacherById =async(id)=>{
const [rows] = await db.query(`
        SELECT 
      tp.id,
      tp.qualification,
      tp.experience_years,
      tp.bio,
      u.name,
      u.email,
      u.phone
    FROM teacher_profiles tp
    JOIN users u ON tp.user_id = u.id
    WHERE tp.id = ?`,[id])
    return rows[0]
}
exports.updateTeacherProfile = async (data) => {
  const { user_id, qualification, experience_years, bio } = data;

  const [result] = await db.query(
    `UPDATE teacher_profiles 
     SET qualification = ?, experience_years = ?, bio = ?
     WHERE user_id = ?`,
    [qualification, experience_years, bio, user_id]
  );

  return result;
};


