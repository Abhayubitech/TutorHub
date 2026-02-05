const db = require("../config/db");

async function getAllStudents() {
    const sql = `
        SELECT 
            u.id, u.name, u.email, u.phone, 
            sp.grade, sp.school_name, sp.address, sp.profile_pic,
            COUNT(ce.id) as enrolled_count,
            GROUP_CONCAT(DISTINCT c.subject SEPARATOR ', ') as enrolled_courses 
        FROM users u
        LEFT JOIN student_profiles sp ON u.id = sp.user_id
        LEFT JOIN course_enrollments ce ON u.id = ce.student_id
        LEFT JOIN courses c ON ce.course_id = c.id
        WHERE u.role = 'student'
        GROUP BY u.id, sp.grade, sp.school_name, sp.address, sp.profile_pic
    `;
    const [rows] = await db.query(sql);
    return rows;
}

async function getAllTeachers() {
    const sql = `
        SELECT u.id, u.name, u.email, u.phone, 
               tp.qualifications as qualification,   
               tp.experience as experience_years,   
               tp.bio, 
               tp.profile_pic,
               COUNT(c.id) as courses_created,
               GROUP_CONCAT(DISTINCT c.subject SEPARATOR ', ') as created_courses
        FROM users u
        LEFT JOIN teacher_profiles tp ON u.id = tp.user_id
        LEFT JOIN courses c ON u.id = c.teacher_id
        WHERE u.role = 'teacher'
        GROUP BY u.id, tp.qualifications, tp.experience, tp.bio, tp.profile_pic
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

async function deleteUser(userId) {
    const [courses] = await db.query("SELECT id FROM courses WHERE teacher_id = ?", [userId]);
    if (courses.length > 0) {
        const courseIds = courses.map(c => c.id);
        await db.query(`DELETE FROM course_schedules WHERE course_id IN (?)`, [courseIds]);
        await db.query(`DELETE FROM course_requests WHERE course_id IN (?)`, [courseIds]);
        await db.query(`DELETE FROM course_enrollments WHERE course_id IN (?)`, [courseIds]);
        await db.query(`DELETE FROM courses WHERE teacher_id = ?`, [userId]);
    }
    await db.query("DELETE FROM course_requests WHERE student_id = ?", [userId]);
    await db.query("DELETE FROM course_enrollments WHERE student_id = ?", [userId]);
    await db.query("DELETE FROM student_profiles WHERE user_id = ?", [userId]);
    await db.query("DELETE FROM teacher_profiles WHERE user_id = ?", [userId]);
    await db.query("DELETE FROM users WHERE id = ?", [userId]);
    return { message: "User deleted" };
}

async function getAdminProfile(id) {
    const sql = "SELECT id, name, email, phone, role FROM users WHERE id = ?";
    const [rows] = await db.query(sql, [id]);
    return rows[0];
}

async function updateAdminProfile(id, data) {
    const sql = "UPDATE users SET name=?, email=?, phone=? WHERE id=?";
    await db.query(sql, [data.name, data.email, data.phone, id]);
    return { message: "Updated" };
}

async function getCourseByNameAndTeacher(name, teacherId) {
    const sql = `
        SELECT c.*, u.name as teacher_name 
        FROM courses c 
        JOIN users u ON c.teacher_id = u.id 
        WHERE c.subject = ? AND c.teacher_id = ?
    `;
    const [rows] = await db.query(sql, [name, teacherId]);
    return rows[0];
}

async function deleteCourse(courseId) {
    await db.query("DELETE FROM course_schedules WHERE course_id = ?", [courseId]);
    await db.query("DELETE FROM course_requests WHERE course_id = ?", [courseId]);
    await db.query("DELETE FROM course_enrollments WHERE course_id = ?", [courseId]);
    await db.query("DELETE FROM courses WHERE id = ?", [courseId]);
    return { message: "Course deleted" };
}

module.exports = { 
    getAllStudents, 
    getAllTeachers, 
    getStats, 
    deleteUser,
    getAdminProfile,   
    updateAdminProfile,
    getCourseByNameAndTeacher,
    deleteCourse
};