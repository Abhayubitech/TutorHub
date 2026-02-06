const courseService = require("../services/course.service");
const whatsappService = require("../services/whatsapp.service");
const paymentService = require("../services/payment.service");
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/payments/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'payment-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get all courses
async function getAllCourses(req, res) {
  try {
    const courses = await courseService.getAllCourses();
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

// Create WhatsApp group for a course
async function createWhatsAppGroup(req, res) {
  try {
    const { courseId, groupName, inviteLink, groupType, description, teacherPhone } = req.body;
    
    if (!courseId || !groupName || !inviteLink) {
      return res.status(400).json({
        success: false,
        message: "Course ID, group name, and invite link are required"
      });
    }

    const groupData = {
      course_id: courseId,
      group_name: groupName,
      invite_link: inviteLink,
      group_type: groupType || 'demo',
      description: description || '',
      teacher_phone: teacherPhone
    };

    const group = await whatsappService.createGroup(groupData);
    res.json({
      success: true,
      message: "WhatsApp group created successfully",
      group
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Get WhatsApp group info for a course
async function getWhatsAppGroup(req, res) {
  try {
    const { courseId } = req.params;
    const { groupType = 'demo' } = req.query;
    
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required"
      });
    }

    const group = await whatsappService.getGroupByCourse(courseId, groupType);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "WhatsApp group not found"
      });
    }

    res.json({
      success: true,
      group
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Add student to WhatsApp group
async function addStudentToGroup(req, res) {
  try {
    const { courseId, phoneNumber } = req.body;
    
    if (!courseId || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Course ID and phone number are required"
      });
    }

    // WhatsApp integration temporarily disabled
    res.json({
      success: false,
      message: "Add student to group functionality temporarily disabled"
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Send Zoom link to WhatsApp group
async function sendZoomLink(req, res) {
  try {
    const { courseId, zoomLink } = req.body;
    
    if (!courseId || !zoomLink) {
      return res.status(400).json({
        success: false,
        message: "Course ID and Zoom link are required"
      });
    }

    // WhatsApp integration temporarily disabled
    res.json({
      success: false,
      message: "Zoom link functionality temporarily disabled"
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Send payment information to WhatsApp group
async function sendPaymentInfo(req, res) {
  try {
    const { courseId, paymentDetails } = req.body;
    
    if (!courseId || !paymentDetails) {
      return res.status(400).json({
        success: false,
        message: "Course ID and payment details are required"
      });
    }

    // WhatsApp integration temporarily disabled
    res.json({
      success: false,
      message: "Payment information functionality temporarily disabled"
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Upload payment screenshot
async function uploadPaymentScreenshot(req, res) {
  try {
    const { courseId, paymentAmount, paymentDate, upiTransactionId } = req.body;
    const studentId = req.user.id;
    
    if (!courseId || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Course ID and payment screenshot are required"
      });
    }

    const paymentData = {
      student_id: studentId,
      course_id: courseId,
      screenshot_path: req.file.path,
      payment_amount: paymentAmount,
      payment_date: paymentDate,
      upi_transaction_id: upiTransactionId
    };

    const payment = await paymentService.createPaymentVerification(paymentData);
    res.json({
      success: true,
      message: "Payment screenshot uploaded successfully",
      payment
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Get payment verifications for a course (teacher only)
async function getPaymentVerifications(req, res) {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.id;
    
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required"
      });
    }

    const verifications = await paymentService.getVerificationsByCourse(courseId, teacherId);
    res.json({
      success: true,
      verifications
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Approve/Reject payment verification
async function updatePaymentVerification(req, res) {
  try {
    const { verificationId } = req.params;
    const { status, teacherNotes } = req.body;
    const teacherId = req.user.id;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'approved' or 'rejected'"
      });
    }

    const verification = await paymentService.updateVerificationStatus(
      verificationId, 
      status, 
      teacherNotes, 
      teacherId
    );
    
    res.json({
      success: true,
      message: `Payment ${status} successfully`,
      verification
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Get student payment status
async function getStudentPaymentStatus(req, res) {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;
    
    const paymentStatus = await paymentService.getStudentPaymentStatus(studentId, courseId);
    
    res.json({
      success: true,
      paymentStatus
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Get all WhatsApp groups for a course (for editing)
async function getAllWhatsAppGroups(req, res) {
  try {
    const { courseId } = req.params;
    
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required"
      });
    }

    const groups = await whatsappService.getGroupsByCourse(courseId);
    
    res.json({
      success: true,
      groups
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// Update WhatsApp group for a course
async function updateWhatsAppGroup(req, res) {
  try {
    const { courseId, groupType } = req.params;
    const { groupName, inviteLink, description, teacherPhone } = req.body;
    const teacherId = req.user.id;
    
    if (!courseId || !groupType) {
      return res.status(400).json({
        success: false,
        message: "Course ID and group type are required"
      });
    }

    // First check if the teacher owns this course
    const course = await courseService.getCourseById(courseId);
    if (!course || course.teacher_id !== teacherId) {
      return res.status(403).json({
        success: false,
        message: "You can only update WhatsApp groups for your own courses"
      });
    }

    // Find existing group
    const existingGroup = await whatsappService.getGroupByCourse(courseId, groupType);
    if (!existingGroup) {
      return res.status(404).json({
        success: false,
        message: "WhatsApp group not found"
      });
    }

    // Update the group
    const updateData = {
      group_name: groupName,
      invite_link: inviteLink,
      description: description,
      teacher_phone: teacherPhone
    };

    const updated = await whatsappService.updateGroup(existingGroup.id, updateData);
    
    if (updated) {
      res.json({
        success: true,
        message: "WhatsApp group updated successfully"
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to update WhatsApp group"
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  getAllCourses,
  createWhatsAppGroup,
  getWhatsAppGroup,
  getAllWhatsAppGroups,
  updateWhatsAppGroup,
  addStudentToGroup,
  sendZoomLink,
  sendPaymentInfo,
  uploadPaymentScreenshot,
  getPaymentVerifications,
  updatePaymentVerification,
  getStudentPaymentStatus,
  upload,
};
