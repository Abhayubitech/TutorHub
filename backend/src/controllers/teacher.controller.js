const teacherService = require("../services/teacher.service");
// const whatsappService = require("../services/whatsapp.service");
const db = require("../config/db");

// Get teacher profile
async function getProfile(req, res) {
  try {
    const teacherId = req.user.id;
    const profile = await teacherService.getTeacherProfile(teacherId);
    res.json({
      success: true,
      profile,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
}

// Create or update teacher profile
async function updateProfile(req, res) {
  try {
    const teacherId = req.user.id;
    const result = await teacherService.updateTeacherProfile(teacherId, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Get all courses
async function getMyCourses(req, res) {
  try {
    const teacherId = req.user.id;
    const courses = await teacherService.getTeacherCourses(teacherId);
    res.json({
      success: true,
      courses,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Get single course by ID
async function getCourseById(req, res) {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.id;
    const course = await teacherService.getCourseById(courseId, teacherId);
    res.json({
      success: true,
      course,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
}

// Create course
async function createCourse(req, res) {
  try {
    const teacherId = req.user.id;
    const result = await teacherService.createCourse(teacherId, req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Update course
async function updateCourse(req, res) {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.id;
    const result = await teacherService.updateCourse(courseId, teacherId, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Delete course
async function deleteCourse(req, res) {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.id;
    const result = await teacherService.deleteCourse(courseId, teacherId);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Add schedule
async function addSchedule(req, res) {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.id;
    const result = await teacherService.addCourseSchedule(courseId, teacherId, req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Get enrollment requests
async function getEnrollmentRequests(req, res) {
  try {
    const teacherId = req.user.id;
    const requests = await teacherService.getEnrollmentRequests(teacherId);
    res.json({
      success: true,
      requests,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Approve/Reject request with WhatsApp integration
async function handleEnrollmentRequest(req, res) {
  try {
    const { requestId } = req.params;
    const { action } = req.body;
    const teacherId = req.user.id;

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be 'approve' or 'reject'",
      });
    }

    const result = await teacherService.handleEnrollmentRequest(
      requestId,
      teacherId,
      action
    );

    // If approved and WhatsApp group exists, add student to group
    if (action === "approve" && result.success) {
      try {
        // Get course and student info
        const connection = await db.getConnection();
        try {
          const [requestInfo] = await connection.execute(`
            SELECT cr.course_id, cr.student_id, c.subject, u.phone as student_phone, u.name as student_name
            FROM course_requests cr
            JOIN courses c ON cr.course_id = c.id
            JOIN users u ON cr.student_id = u.id
            WHERE cr.id = ?
          `, [requestId]);

          if (requestInfo.length > 0) {
            const { course_id, student_phone, student_name, subject } = requestInfo[0];
            
            // WhatsApp integration temporarily disabled
            // Check if WhatsApp group exists for this course
            // const groupInfo = await whatsappService.getGroupInfo(course_id);
            // 
            // if (groupInfo && whatsappService.isClientConnected()) {
            //   // Add student to WhatsApp group
            //   await whatsappService.addParticipantToGroup(groupInfo.group_id, student_phone);
            //   
            //   // Add student to group members in database
            //   await connection.execute(`
            //     INSERT INTO whatsapp_group_members (group_id, user_id, phone, role) 
            //     VALUES (?, (SELECT id FROM users WHERE phone = ?), ?, 'student')
            //   `, [groupInfo.id, student_phone, student_phone]);
            // 
            //   // Send welcome message to group
            //   const welcomeMessage = `🎉 *New Student Joined!*\n\nWelcome ${student_name} to the ${subject} course!\n\n📚 You'll receive Zoom links and payment updates here.\n🔔 Stay tuned for important announcements.`;
            //   await whatsappService.sendMessageToGroup(groupInfo.group_id, welcomeMessage);
            //   
            //   result.whatsappGroupAdded = true;
            //   result.inviteLink = groupInfo.invite_link;
            // }
          }
        } finally {
          connection.release();
        }
      } catch (whatsappError) {
        console.error('WhatsApp integration error:', whatsappError);
        // Don't fail the approval if WhatsApp fails
        result.whatsappGroupAdded = false;
        result.whatsappError = whatsappError.message;
      }
    }

    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Get enrolled students
async function getEnrolledStudents(req, res) {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.id;
    const students = await teacherService.getEnrolledStudents(courseId, teacherId);
    res.json({
      success: true,
      students,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getMyCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addSchedule,
  getEnrollmentRequests,
  handleEnrollmentRequest,
  getEnrolledStudents,
};
