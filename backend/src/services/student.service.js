const db = require("../config/db");

// Get all courses with teacher info
async function getAllCourses() {
  try {
    const [courses] = await db.query(
      `SELECT c.*, u.name as teacher_name, u.email, tp.qualification, tp.bio
       FROM courses c
       JOIN users u ON c.teacher_id = u.id
       LEFT JOIN teacher_profiles tp ON u.id = tp.user_id
       ORDER BY c.created_at DESC`
    );

    return courses;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Get course details with schedule and teacher info
async function getCourseDetails(courseId) {
  try {
    const [courses] = await db.query(
      `SELECT c.*, u.name as teacher_name, u.email, u.phone, tp.qualification, tp.bio, tp.specializations
       FROM courses c
       JOIN users u ON c.teacher_id = u.id
       LEFT JOIN teacher_profiles tp ON u.id = tp.user_id
       WHERE c.id = ?`,
      [courseId]
    );

    if (courses.length === 0) {
      throw new Error("Course not found");
    }

    const [schedules] = await db.query(
      "SELECT day, start_time, end_time FROM course_schedules WHERE course_id = ? ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')",
      [courseId]
    );

    return {
      ...courses[0],
      schedules,
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

// Search courses
async function searchCourses(query) {
  try {
    const [courses] = await db.query(
      `SELECT c.*, u.name as teacher_name
       FROM courses c
       JOIN users u ON c.teacher_id = u.id
       WHERE c.subject LIKE ? OR c.description LIKE ? OR u.name LIKE ?`,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );

    return courses;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Request to enroll in course
async function requestEnrollment(studentId, courseId) {
  try {
    // Check if already enrolled
    const [existing] = await db.query(
      "SELECT id FROM course_enrollments WHERE student_id = ? AND course_id = ?",
      [studentId, courseId]
    );

    if (existing.length > 0) {
      throw new Error("Already enrolled in this course");
    }

    // Check if already requested
    const [requested] = await db.query(
      "SELECT id, status, rejection_date FROM course_requests WHERE student_id = ? AND course_id = ?",
      [studentId, courseId]
    );

    if (requested.length > 0) {
      const request = requested[0];
      
      if (request.status === 'pending') {
        throw new Error("Enrollment request already pending");
      }
      
      if (request.status === 'rejected') {
        // Check if 11-day waiting period has passed
        if (request.rejection_date) {
          const rejectionDate = new Date(request.rejection_date);
          const currentDate = new Date();
          const daysSinceRejection = Math.floor((currentDate - rejectionDate) / (1000 * 60 * 60 * 24));
          
          if (daysSinceRejection < 11) {
            const daysRemaining = 11 - daysSinceRejection;
            throw new Error(`You must wait ${daysRemaining} more day(s) before applying again for this course`);
          }
        } else {
          throw new Error("Your previous request was rejected. Please wait 11 days before applying again.");
        }
      }
    }

    const [result] = await db.query(
      "INSERT INTO course_requests (student_id, course_id) VALUES (?, ?)",
      [studentId, courseId]
    );

    return {
      success: true,
      message: "Enrollment request sent successfully",
      requestId: result.insertId,
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

// Get student's enrollment requests
async function getMyRequests(studentId) {
  try {
    const [requests] = await db.query(
      `SELECT cr.*, c.subject, u.name as teacher_name
       FROM course_requests cr
       JOIN courses c ON cr.course_id = c.id
       JOIN users u ON c.teacher_id = u.id
       WHERE cr.student_id = ?
       ORDER BY cr.request_date DESC`,
      [studentId]
    );

    // Add remaining waiting days for rejected requests
    for (let request of requests) {
      if (request.status === 'rejected' && request.rejection_date) {
        const rejectionDate = new Date(request.rejection_date);
        const currentDate = new Date();
        const daysSinceRejection = Math.floor((currentDate - rejectionDate) / (1000 * 60 * 60 * 24));
        
        if (daysSinceRejection < 11) {
          request.days_remaining = 11 - daysSinceRejection;
          request.can_reapply = false;
        } else {
          request.days_remaining = 0;
          request.can_reapply = true;
        }
      } else if (request.status === 'rejected') {
        // For old rejections without rejection_date, assume they can reapply
        request.days_remaining = 0;
        request.can_reapply = true;
      }
    }

    return requests;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Get student's enrolled courses
async function getMyEnrollments(studentId) {
  try {
    const [courses] = await db.query(
      `SELECT c.*, u.name as teacher_name, ce.enrolled_at
       FROM course_enrollments ce
       JOIN courses c ON ce.course_id = c.id
       JOIN users u ON c.teacher_id = u.id
       WHERE ce.student_id = ?
       ORDER BY ce.enrolled_at DESC`,
      [studentId]
    );

    return courses;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Cancel enrollment request
async function cancelRequest(requestId, studentId) {
  try {
    const [request] = await db.query(
      "SELECT student_id FROM course_requests WHERE id = ?",
      [requestId]
    );

    if (request.length === 0) {
      throw new Error("Request not found");
    }

    if (request[0].student_id !== studentId) {
      throw new Error("Unauthorized");
    }

    await db.query("DELETE FROM course_requests WHERE id = ?", [requestId]);

    return {
      success: true,
      message: "Request cancelled successfully",
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

// Get all teachers with their courses
async function getAllTeachers() {
  try {
    const [teachers] = await db.query(
      `SELECT u.id, u.name, u.email, u.phone, tp.qualification, tp.bio, tp.specializations, tp.hourly_rate, tp.is_verified
       FROM users u
       LEFT JOIN teacher_profiles tp ON u.id = tp.user_id
       WHERE u.role = 'teacher'
       ORDER BY tp.is_verified DESC, u.name ASC`
    );

    // Get courses for each teacher
    for (let teacher of teachers) {
      const [courses] = await db.query(
        `SELECT id, subject, description, fee, mode, start_date, end_date 
         FROM courses 
         WHERE teacher_id = ? 
         ORDER BY created_at DESC`,
        [teacher.id]
      );
      teacher.courses = courses;
    }

    return teachers;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Get teacher details with courses
async function getTeacherDetails(teacherId) {
  try {
    const [teacher] = await db.query(
      `SELECT u.id, u.name, u.email, u.phone, tp.qualification, tp.bio, tp.specializations, tp.hourly_rate, tp.is_verified
       FROM users u
       LEFT JOIN teacher_profiles tp ON u.id = tp.user_id
       WHERE u.id = ? AND u.role = 'teacher'`,
      [teacherId]
    );

    if (teacher.length === 0) {
      throw new Error("Teacher not found");
    }

    const [courses] = await db.query(
      "SELECT id, subject, description, fee, mode FROM courses WHERE teacher_id = ? AND start_date > CURDATE()",
      [teacherId]
    );

    return {
      ...teacher[0],
      courses,
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  getAllCourses,
  getCourseDetails,
  searchCourses,
  requestEnrollment,
  getMyRequests,
  getMyEnrollments,
  cancelRequest,
  getAllTeachers,
  getTeacherDetails,
};
