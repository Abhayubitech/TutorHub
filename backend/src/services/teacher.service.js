const db = require("../config/db");

// ✅ VALIDATION FUNCTIONS
const validateString = (value, fieldName, minLength = 1, maxLength = 255) => {
  if (!value || typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${fieldName} is required and cannot be empty`);
  }
  if (value.length > maxLength) {
    throw new Error(`${fieldName} must not exceed ${maxLength} characters`);
  }
  if (value.length < minLength) {
    throw new Error(`${fieldName} must be at least ${minLength} characters long`);
  }
};

const validateNumber = (value, fieldName, min = 0, max = 999999) => {
  if (value === null || value === undefined || value === '') {
    throw new Error(`${fieldName} is required`);
  }
  const num = parseFloat(value);
  if (isNaN(num)) {
    throw new Error(`${fieldName} must be a valid number`);
  }
  if (num < min || num > max) {
    throw new Error(`${fieldName} must be between ${min} and ${max}`);
  }
};

const validateDate = (date) => {
  if (!date) return; // Optional
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date format');
  }
};

const validateTimeFormat = (time) => {
  if (!time) throw new Error('Time is required');
  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    throw new Error('Invalid time format. Use HH:MM (24-hour format)');
  }
};

// Get teacher profile
async function getTeacherProfile(teacherId) {
  try {
    const [profile] = await db.query(
      "SELECT * FROM teacher_profiles WHERE user_id = ?",
      [teacherId]
    );

    if (profile.length === 0) {
      throw new Error("Teacher profile not found");
    }

    return profile[0];
  } catch (err) {
    throw new Error(err.message);
  }
}

// Create or update teacher profile
async function updateTeacherProfile(teacherId, profileData) {
  try {
    const { qualification, experience_years, bio, specializations, hourly_rate } = profileData;

    // ✅ Validate all inputs
    if (qualification) validateString(qualification, 'Qualification', 2, 255);
    if (experience_years !== undefined && experience_years !== null) validateNumber(experience_years, 'Experience years', 0, 70);
    if (bio) validateString(bio, 'Bio', 10, 1000);
    if (specializations) validateString(specializations, 'Specializations', 3, 500);
    if (hourly_rate !== undefined && hourly_rate !== null) validateNumber(hourly_rate, 'Hourly rate', 0, 10000);

    const [existing] = await db.query(
      "SELECT id FROM teacher_profiles WHERE user_id = ?",
      [teacherId]
    );

    if (existing.length === 0) {
      const [result] = await db.query(
        "INSERT INTO teacher_profiles (user_id, qualification, experience_years, bio, specializations, hourly_rate) VALUES (?, ?, ?, ?, ?, ?)",
        [teacherId, qualification, experience_years, bio, specializations, hourly_rate]
      );
      return {
        success: true,
        message: "Teacher profile created successfully",
        profileId: result.insertId,
      };
    } else {
      await db.query(
        "UPDATE teacher_profiles SET qualification = ?, experience_years = ?, bio = ?, specializations = ?, hourly_rate = ? WHERE user_id = ?",
        [qualification, experience_years, bio, specializations, hourly_rate, teacherId]
      );
      return {
        success: true,
        message: "Teacher profile updated successfully",
      };
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

// Get all courses by teacher
async function getTeacherCourses(teacherId) {
  try {
    const [courses] = await db.query(
      "SELECT * FROM courses WHERE teacher_id = ?",
      [teacherId]
    );

    return courses;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Create a course
async function createCourse(teacherId, courseData) {
  try {
    const { subject, description, fee, mode, start_date, end_date, max_students } = courseData;

    // ✅ Validate all inputs
    validateString(subject, 'Subject', 2, 100);
    if (description) validateString(description, 'Description', 5, 1000);
    validateNumber(fee, 'Fee', 0, 100000);
    
    const validModes = ['online', 'offline', 'hybrid'];
    if (!validModes.includes(mode)) {
      throw new Error('Invalid mode. Must be online, offline, or hybrid');
    }
    
    validateDate(start_date);
    validateDate(end_date);
    if (start_date && end_date && new Date(start_date) >= new Date(end_date)) {
      throw new Error('Start date must be before end date');
    }
    
    if (max_students) validateNumber(max_students, 'Max students', 1, 500);

    const [result] = await db.query(
      "INSERT INTO courses (teacher_id, subject, description, fee, mode, start_date, end_date, max_students) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [teacherId, subject, description, fee, mode, start_date, end_date, max_students || 30]
    );

    return {
      success: true,
      message: "Course created successfully",
      courseId: result.insertId,
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

// Update a course
async function updateCourse(courseId, teacherId, courseData) {
  try {
    const { subject, description, fee, mode, start_date, end_date, max_students } = courseData;

    const [course] = await db.query(
      "SELECT teacher_id FROM courses WHERE id = ?",
      [courseId]
    );

    if (course.length === 0) {
      throw new Error("Course not found");
    }

    if (course[0].teacher_id !== teacherId) {
      throw new Error("Unauthorized: You can only update your own courses");
    }

    await db.query(
      "UPDATE courses SET subject = ?, description = ?, fee = ?, mode = ?, start_date = ?, end_date = ?, max_students = ? WHERE id = ?",
      [subject, description, fee, mode, start_date, end_date, max_students || 30, courseId]
    );

    return {
      success: true,
      message: "Course updated successfully",
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

// Delete a course
async function deleteCourse(courseId, teacherId) {
  try {
    const [course] = await db.query(
      "SELECT teacher_id FROM courses WHERE id = ?",
      [courseId]
    );

    if (course.length === 0) {
      throw new Error("Course not found");
    }

    if (course[0].teacher_id !== teacherId) {
      throw new Error("Unauthorized: You can only delete your own courses");
    }

    await db.query("DELETE FROM courses WHERE id = ?", [courseId]);

    return {
      success: true,
      message: "Course deleted successfully",
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

// Add course schedule
async function addCourseSchedule(courseId, teacherId, scheduleData) {
  try {
    const { day, start_time, end_time } = scheduleData;

    // ✅ Validate inputs
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (!validDays.includes(day)) {
      throw new Error('Invalid day. Must be a valid weekday');
    }
    validateTimeFormat(start_time);
    validateTimeFormat(end_time);
    
    if (start_time >= end_time) {
      throw new Error('Start time must be before end time');
    }

    const [course] = await db.query(
      "SELECT teacher_id FROM courses WHERE id = ?",
      [courseId]
    );

    if (course.length === 0) {
      throw new Error("Course not found");
    }

    if (course[0].teacher_id !== teacherId) {
      throw new Error("Unauthorized");
    }

    const [result] = await db.query(
      "INSERT INTO course_schedules (course_id, day, start_time, end_time) VALUES (?, ?, ?, ?)",
      [courseId, day, start_time, end_time]
    );

    return {
      success: true,
      message: "Schedule added successfully",
      scheduleId: result.insertId,
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

// Get enrollment requests for teacher's courses
async function getEnrollmentRequests(teacherId) {
  try {
    const [requests] = await db.query(
      `SELECT cr.*, u.name as student_name, u.email, c.subject
       FROM course_requests cr
       JOIN users u ON cr.student_id = u.id
       JOIN courses c ON cr.course_id = c.id
       WHERE c.teacher_id = ? AND cr.status = 'pending'
       ORDER BY cr.request_date DESC`,
      [teacherId]
    );

    return requests;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Approve/Reject enrollment request
async function handleEnrollmentRequest(requestId, teacherId, action) {
  try {
    const [request] = await db.query(
      `SELECT cr.* FROM course_requests cr
       JOIN courses c ON cr.course_id = c.id
       WHERE cr.id = ? AND c.teacher_id = ?`,
      [requestId, teacherId]
    );

    if (request.length === 0) {
      throw new Error("Request not found or unauthorized");
    }

    const status = action === "approve" ? "approved" : "rejected";
    await db.query(
      "UPDATE course_requests SET status = ?, response_date = NOW() WHERE id = ?",
      [status, requestId]
    );

    if (action === "approve") {
      const { student_id, course_id } = request[0];
      await db.query(
        "INSERT IGNORE INTO course_enrollments (student_id, course_id) VALUES (?, ?)",
        [student_id, course_id]
      );
    }

    return {
      success: true,
      message: `Request ${status} successfully`,
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

// Get enrolled students for a course
async function getEnrolledStudents(courseId, teacherId) {
  try {
    const [students] = await db.query(
      `SELECT u.id, u.name, u.email, u.phone, ce.enrolled_at
       FROM course_enrollments ce
       JOIN users u ON ce.student_id = u.id
       JOIN courses c ON ce.course_id = c.id
       WHERE ce.course_id = ? AND c.teacher_id = ?`,
      [courseId, teacherId]
    );

    return students;
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  getTeacherProfile,
  updateTeacherProfile,
  getTeacherCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  addCourseSchedule,
  getEnrollmentRequests,
  handleEnrollmentRequest,
  getEnrolledStudents,
};
