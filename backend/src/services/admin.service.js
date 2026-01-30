const db = require("../config/db");

async function getAllStudents() {
    const sql = `
        SELECT users.id, users.name, users.email, users.phone, 
               student_profiles.grade, student_profiles.school_name, student_profiles.address
        FROM users
        LEFT JOIN student_profiles ON users.id = student_profiles.user_id
        WHERE users.role = 'student'
    `;
    const [rows] = await db.query(sql);
    return rows;
}

async function getAllTeachers() {
    const sql = `
        SELECT users.id, users.name, users.email, users.phone, 
               teacher_profiles.qualification, teacher_profiles.experience_years, teacher_profiles.bio
        FROM users
        LEFT JOIN teacher_profiles ON users.id = teacher_profiles.user_id
        WHERE users.role = 'teacher'
    `;
    const [rows] = await db.query(sql);
    return rows;
}

async function getStats() {
    const [studentCount] = await db.query("SELECT COUNT(*) as total FROM users WHERE role='student'");
    const [teacherCount] = await db.query("SELECT COUNT(*) as total FROM users WHERE role='teacher'");
    const [courseCount] = await db.query("SELECT COUNT(*) as total FROM courses");

    return {
        total_students: studentCount[0].total,
        total_teachers: teacherCount[0].total,
        total_courses: courseCount[0].total
    };
}

module.exports = { getAllStudents, getAllTeachers, getStats };