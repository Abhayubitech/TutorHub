const db = require("../config/db");

async function createRequest(studentId, courseId) {
    // Check if already requested or enrolled
    const [existing] = await db.query(
        "SELECT * FROM course_requests WHERE student_id = ? AND course_id = ? AND status IN ('pending', 'approved')",
        [studentId, courseId]
    );

    if (existing.length > 0) {
        throw new Error("Request already exists or already enrolled");
    }

    const [result] = await db.query(
        "INSERT INTO course_requests (student_id, course_id) VALUES (?, ?)",
        [studentId, courseId]
    );
    return { id: result.insertId, student_id: studentId, course_id: courseId, status: 'pending' };
}

async function getRequestsForTeacher(teacherId) {
    const [rows] = await db.query(`
        SELECT r.*, c.subject, u.name as student_name 
        FROM course_requests r 
        JOIN courses c ON r.course_id = c.id 
        JOIN users u ON r.student_id = u.id 
        WHERE c.teacher_id = ? AND r.status = 'pending'
    `, [teacherId]);
    return rows;
}

async function updateRequestStatus(requestId, status) {
    await db.query("UPDATE course_requests SET status = ? WHERE id = ?", [status, requestId]);

    if (status === 'approved') {
        // Add to enrollments
        const [reqData] = await db.query("SELECT * FROM course_requests WHERE id = ?", [requestId]);
        if (reqData.length > 0) {
            const { student_id, course_id } = reqData[0];
            await db.query("INSERT INTO course_enrollments (student_id, course_id) VALUES (?, ?)", [student_id, course_id]);
        }
    }
    return { id: requestId, status };
}

async function getStudentEnrollments(studentId) {
    const [rows] = await db.query(`
        SELECT e.*, c.subject, c.description, c.mode, u.name as teacher_name 
        FROM course_enrollments e
        JOIN courses c ON e.course_id = c.id
        JOIN users u ON c.teacher_id = u.id
        WHERE e.student_id = ?
    `, [studentId]);
    return rows;
}

module.exports = { createRequest, getRequestsForTeacher, updateRequestStatus, getStudentEnrollments };
