const db = require("../config/db");
const whatsappService = require("./whatsapp.service");

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
      `SELECT c.*, 
              COUNT(ce.id) as enrolled_count,
              GROUP_CONCAT(
                CONCAT(cs.day, ' ', cs.start_time, '-', cs.end_time) 
                SEPARATOR ', '
              ) as schedule
       FROM courses c
       LEFT JOIN course_enrollments ce ON c.id = ce.course_id
       LEFT JOIN course_schedules cs ON c.id = cs.course_id
       WHERE c.teacher_id = ?
       GROUP BY c.id
       ORDER BY c.created_at DESC`,
      [teacherId]
    );

    return courses;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Get single course by ID with full details for editing
async function getCourseById(courseId, teacherId) {
  try {
    // Get basic course info with schedule and duration
    const [courses] = await db.query(
      `SELECT c.*, 
              GROUP_CONCAT(
                CONCAT(cs.day, ' ', cs.start_time, '-', cs.end_time) 
                SEPARATOR ', '
              ) as schedule,
              GROUP_CONCAT(cs.day SEPARATOR ', ') as schedule_days,
              GROUP_CONCAT(CONCAT(cs.start_time, '-', cs.end_time) SEPARATOR ', ') as schedule_time,
              cm.duration_per_class
       FROM courses c
       LEFT JOIN course_schedules cs ON c.id = cs.course_id
       LEFT JOIN course_metadata cm ON c.id = cm.course_id
       WHERE c.id = ? AND c.teacher_id = ?
       GROUP BY c.id`,
      [courseId, teacherId]
    );

    if (courses.length === 0) {
      throw new Error("Course not found or unauthorized");
    }

    return courses[0];
  } catch (err) {
    throw new Error(err.message);
  }
}

// Create a course
async function createCourse(teacherId, courseData) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    const { subject, description, fee, mode, start_date, end_date, max_students, schedule_days, schedule_time, duration_per_class } = courseData;

    console.log('Creating course with data:', { teacherId, subject, description, fee, mode, start_date, end_date, max_students });

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

    // Insert course
    const [result] = await connection.execute(
      "INSERT INTO courses (teacher_id, subject, description, fee, mode, start_date, end_date, max_students) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [teacherId, subject, description, fee, mode, start_date, end_date, max_students || 30]
    );

    const courseId = result.insertId;
    console.log('Course created with ID:', courseId);

    // Add schedule if provided
    if (schedule_days && schedule_time) {
      const days = schedule_days.split(',').map(day => day.trim());
      const [startTime, endTime] = schedule_time.split('-').map(time => time.trim());
      
      for (const day of days) {
        if (day && startTime && endTime) {
          await connection.execute(
            "INSERT INTO course_schedules (course_id, day, start_time, end_time) VALUES (?, ?, ?, ?)",
            [courseId, day, startTime, endTime]
          );
          console.log('Added schedule for day:', day);
        }
      }
    }

    // Add duration per class if provided
    if (duration_per_class !== undefined) {
      // Check if course_metadata table exists, if not create it
      try {
        await connection.execute(`
          CREATE TABLE IF NOT EXISTS course_metadata (
            id INT PRIMARY KEY AUTO_INCREMENT,
            course_id INT NOT NULL,
            duration_per_class INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
            UNIQUE KEY unique_course_metadata (course_id)
          )
        `);
      } catch (err) {
        console.log('Course metadata table might already exist:', err.message);
      }
      
      await connection.execute(`
        INSERT INTO course_metadata (course_id, duration_per_class) 
        VALUES (?, ?) 
        ON DUPLICATE KEY UPDATE duration_per_class = ?, updated_at = CURRENT_TIMESTAMP
      `, [courseId, duration_per_class, duration_per_class]);
      
      console.log('Added duration per class:', duration_per_class);
    }

    await connection.commit();
    
    return {
      success: true,
      message: "Course created successfully",
      courseId: courseId,
    };
  } catch (err) {
    await connection.rollback();
    console.error('Course creation error:', err);
    throw new Error(err.message);
  } finally {
    connection.release();
  }
}

// Update a course
async function updateCourse(courseId, teacherId, courseData) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    const { 
      subject, 
      description, 
      fee, 
      mode, 
      start_date, 
      end_date, 
      max_students,
      schedule_days,
      schedule_time,
      duration_per_class
    } = courseData;

    console.log('Updating course with data:', { courseId, teacherId, subject, description, fee, mode, start_date, end_date, max_students });

    // Verify course ownership
    const [course] = await connection.execute(
      "SELECT teacher_id FROM courses WHERE id = ?",
      [courseId]
    );

    if (course.length === 0) {
      throw new Error("Course not found");
    }

    if (course[0].teacher_id !== teacherId) {
      throw new Error("Unauthorized: You can only update your own courses");
    }

    // Update basic course info
    await connection.execute(
      "UPDATE courses SET subject = ?, description = ?, fee = ?, mode = ?, start_date = ?, end_date = ?, max_students = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [subject, description, fee, mode, start_date, end_date, max_students || 30, courseId]
    );

    console.log('Course basic info updated');

    // Update schedule if provided
    if (schedule_days !== undefined || schedule_time !== undefined) {
      // Delete existing schedules for this course
      await connection.execute("DELETE FROM course_schedules WHERE course_id = ?", [courseId]);
      console.log('Existing schedules deleted');
      
      // If schedule data is provided, add new schedule
      if (schedule_days && schedule_time) {
        const days = schedule_days.split(',').map(day => day.trim());
        const [startTime, endTime] = schedule_time.split('-').map(time => time.trim());
        
        for (const day of days) {
          if (day && startTime && endTime) {
            await connection.execute(
              "INSERT INTO course_schedules (course_id, day, start_time, end_time) VALUES (?, ?, ?, ?)",
              [courseId, day, startTime, endTime]
            );
            console.log('Added schedule for day:', day);
          }
        }
      }
    }

    // Update duration per class if provided
    if (duration_per_class !== undefined) {
      // Check if course_metadata table exists, if not create it
      try {
        await connection.execute(`
          CREATE TABLE IF NOT EXISTS course_metadata (
            id INT PRIMARY KEY AUTO_INCREMENT,
            course_id INT NOT NULL,
            duration_per_class INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
            UNIQUE KEY unique_course_metadata (course_id)
          )
        `);
      } catch (err) {
        console.log('Course metadata table might already exist:', err.message);
      }
      
      await connection.execute(`
        INSERT INTO course_metadata (course_id, duration_per_class) 
        VALUES (?, ?) 
        ON DUPLICATE KEY UPDATE duration_per_class = ?, updated_at = CURRENT_TIMESTAMP
      `, [courseId, duration_per_class, duration_per_class]);
      
      console.log('Updated duration per class:', duration_per_class);
    }

    await connection.commit();
    
    return {
      success: true,
      message: "Course updated successfully",
    };
  } catch (err) {
    await connection.rollback();
    console.error('Course update error:', err);
    throw new Error(err.message);
  } finally {
    connection.release();
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
    
    if (action === "reject") {
      // Set rejection_date when rejecting
      await db.query(
        "UPDATE course_requests SET status = ?, response_date = NOW(), rejection_date = NOW() WHERE id = ?",
        [status, requestId]
      );
    } else {
      // Clear rejection_date when approving (in case of re-approval)
      await db.query(
        "UPDATE course_requests SET status = ?, response_date = NOW(), rejection_date = NULL WHERE id = ?",
        [status, requestId]
      );
    }

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

// WhatsApp group management methods
async function createWhatsAppGroup(groupData) {
  try {
    const result = await whatsappService.createGroup(groupData);
    return {
      success: true,
      message: 'WhatsApp group created successfully',
      data: result
    };
  } catch (error) {
    console.error('Error creating WhatsApp group:', error);
    throw new Error(error.message);
  }
}

async function getWhatsAppGroups(courseId) {
  try {
    const groups = await whatsappService.getGroupsByCourse(courseId);
    return {
      success: true,
      groups: groups
    };
  } catch (error) {
    console.error('Error getting WhatsApp groups:', error);
    throw new Error(error.message);
  }
}

async function updateWhatsAppGroup(courseId, groupType, updateData) {
  try {
    // First get the group by course and type
    const group = await whatsappService.getGroupByCourse(courseId, groupType);
    if (!group) {
      throw new Error('WhatsApp group not found');
    }
    
    // Update the group
    const success = await whatsappService.updateGroup(group.id, updateData);
    if (!success) {
      throw new Error('Failed to update WhatsApp group');
    }
    
    return {
      success: true,
      message: 'WhatsApp group updated successfully'
    };
  } catch (error) {
    console.error('Error updating WhatsApp group:', error);
    throw new Error(error.message);
  }
}

async function getPaymentVerifications(courseId) {
  try {
    const [verifications] = await db.query(
      `SELECT pv.*, u.name as student_name, u.email, c.subject
       FROM payment_verifications pv
       JOIN users u ON pv.student_id = u.id
       JOIN courses c ON pv.course_id = c.id
       WHERE pv.course_id = ?
       ORDER BY pv.created_at DESC`,
      [courseId]
    );

    return {
      success: true,
      verifications: verifications
    };
  } catch (error) {
    console.error('Error getting payment verifications:', error);
    throw new Error(error.message);
  }
}

async function updatePaymentVerification(verificationId, status, teacherNotes) {
  try {
    const [result] = await db.query(
      `UPDATE payment_verifications 
       SET status = ?, teacher_notes = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [status, teacherNotes, verificationId]
    );

    if (result.affectedRows === 0) {
      throw new Error('Payment verification not found');
    }

    return {
      success: true,
      message: `Payment verification ${status} successfully`
    };
  } catch (error) {
    console.error('Error updating payment verification:', error);
    throw new Error(error.message);
  }
}

async function loadEnrolledStudents(courseId) {
  try {
    const [students] = await db.query(
      `SELECT u.id, u.name, u.email, u.phone, ce.enrolled_at,
              CASE 
                WHEN pv.status = 'approved' THEN 100
                WHEN pv.status = 'pending' THEN 50
                ELSE 0
              END as progress
       FROM course_enrollments ce
       JOIN users u ON ce.student_id = u.id
       LEFT JOIN payment_verifications pv ON ce.course_id = pv.course_id AND ce.student_id = pv.student_id
       WHERE ce.course_id = ?
       ORDER BY ce.enrolled_at DESC`,
      [courseId]
    );

    return {
      success: true,
      students: students
    };
  } catch (error) {
    console.error('Error loading enrolled students:', error);
    throw new Error(error.message);
  }
}

module.exports = {
  getTeacherProfile,
  updateTeacherProfile,
  getTeacherCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addCourseSchedule,
  getEnrollmentRequests,
  handleEnrollmentRequest,
  getEnrolledStudents,
  createWhatsAppGroup,
  getWhatsAppGroups,
  updateWhatsAppGroup,
  getPaymentVerifications,
  updatePaymentVerification,
  loadEnrolledStudents,
};
