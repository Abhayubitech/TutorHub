const db = require("../config/db");

async function createCourse(courseData) {
  const { teacher_id, subject, description, fee, mode, start_date, end_date, schedules } = courseData;
  const [courseResult] = await db.query(
    "INSERT INTO courses (teacher_id, subject, description, fee, mode, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [teacher_id, subject, description, fee, mode, start_date, end_date]
  );
  const newCourseId = courseResult.insertId;
  if (schedules && schedules.length > 0) {
    const scheduleValues = schedules.map(s => [newCourseId, s.day, s.start_time, s.end_time]);
    await db.query("INSERT INTO course_schedules (course_id, day, start_time, end_time) VALUES ?", [scheduleValues]);
  }
  return { id: newCourseId, message: "Course and Schedules created" };
}


async function getAllCourses() {
  const [rows] = await db.query(`
    SELECT 
        courses.*, 
        users.name as teacher_name,
        
        -- Teacher Profile Details (LEFT JOIN)
        tp.profile_pic as teacher_pic,
        tp.qualifications as teacher_qualifications,
        tp.bio as teacher_bio

    FROM courses 
    JOIN users ON courses.teacher_id = users.id
    LEFT JOIN teacher_profiles tp ON users.id = tp.user_id
    ORDER BY courses.created_at DESC
  `);
  return rows;
}


async function enrollStudent(student_id, course_id) {
    const [existing] = await db.query("SELECT * FROM course_requests WHERE student_id=? AND course_id=?", [student_id, course_id]);
    if(existing.length > 0) throw new Error("Already applied for this course");
    
    const [result] = await db.query(
        "INSERT INTO course_requests (student_id, course_id, status) VALUES (?, ?, 'pending')",
        [student_id, course_id]
    );
    return result;
}


async function getTeacherRequests(teacher_id) {
    const [rows] = await db.query(`
        SELECT 
            r.id as request_id, 
            r.status, 
            r.request_date,
            r.student_id,
            r.course_id,
            
            -- User Table Details
            u.name as student_name, 
            u.email as student_email, 
            u.phone as student_phone,

            -- Course Details
            c.subject as course_name, 

            -- Student Profile Details (LEFT JOIN)
            sp.profile_pic,
            sp.grade,
            sp.school_name,
            sp.address
            -- ❌ REMOVED sp.bio because column does not exist in DB

        FROM course_requests r
        JOIN courses c ON r.course_id = c.id
        JOIN users u ON r.student_id = u.id
        LEFT JOIN student_profiles sp ON u.id = sp.user_id 
        
        WHERE c.teacher_id = ?
        ORDER BY r.request_date DESC
    `, [teacher_id]);
    
    return rows;
}

async function updateRequestStatus(requestId, status, studentId, courseId) {
    
    await db.query("UPDATE course_requests SET status = ? WHERE id = ?", [status, requestId]);

    if (status === 'approved') {
        
        await db.query("INSERT INTO course_enrollments (student_id, course_id) VALUES (?, ?)", [studentId, courseId]);
    }
    return { message: `Request ${status}` };
}


async function deleteCourse(courseId) {
    
    await db.query("DELETE FROM course_schedules WHERE course_id = ?", [courseId]);
    await db.query("DELETE FROM course_requests WHERE course_id = ?", [courseId]);
    await db.query("DELETE FROM course_enrollments WHERE course_id = ?", [courseId]);
    await db.query("DELETE FROM courses WHERE id = ?", [courseId]);
    return { message: "Course deleted successfully" };
}

async function getStudentRequests(student_id) {
    const [rows] = await db.query("SELECT * FROM course_requests WHERE student_id = ?", [student_id]);
    return rows;
}

async function getEnrolledStudents(courseId) {
    const [rows] = await db.query(`
        SELECT u.id, u.name, u.email, u.phone, e.enrolled_at
        FROM course_enrollments e
        JOIN users u ON e.student_id = u.id
        WHERE e.course_id = ?
        ORDER BY e.enrolled_at DESC
    `, [courseId]);
    return rows;
}

async function getCourseById(courseId) {
    const [course] = await db.query("SELECT * FROM courses WHERE id = ?", [courseId]);
    if (course.length === 0) return null;

    const [schedules] = await db.query("SELECT day, start_time, end_time FROM course_schedules WHERE course_id = ?", [courseId]);
    
    return { ...course[0], schedules };
}

async function updateCourse(courseId, courseData) {
    const { subject, description, fee, mode, start_date, end_date, schedules } = courseData;

    await db.query(
        "UPDATE courses SET subject=?, description=?, fee=?, mode=?, start_date=?, end_date=? WHERE id=?",
        [subject, description, fee, mode, start_date, end_date, courseId]
    );

    await db.query("DELETE FROM course_schedules WHERE course_id = ?", [courseId]);

    if (schedules && schedules.length > 0) {
        const scheduleValues = schedules.map(s => [courseId, s.day, s.start_time, s.end_time]);
        await db.query("INSERT INTO course_schedules (course_id, day, start_time, end_time) VALUES ?", [scheduleValues]);
    }

    return { message: "Course Updated Successfully" };
}

module.exports = { 
    createCourse, getAllCourses, enrollStudent, 
    getTeacherRequests, updateRequestStatus, deleteCourse, getStudentRequests, getEnrolledStudents, getCourseById, updateCourse
};