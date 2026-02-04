const courseService = require("../services/course.service");
// const whatsappService = require("../services/whatsapp.service");

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
    const { courseId, courseName, teacherPhone } = req.body;
    
    if (!courseId || !courseName || !teacherPhone) {
      return res.status(400).json({
        success: false,
        message: "Course ID, course name, and teacher phone are required"
      });
    }

    // WhatsApp integration temporarily disabled
    res.json({
      success: false,
      message: "WhatsApp group creation temporarily disabled"
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
    
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required"
      });
    }

    // WhatsApp integration temporarily disabled
    res.json({
      success: false,
      message: "WhatsApp group functionality temporarily disabled"
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

module.exports = {
  getAllCourses,
  createWhatsAppGroup,
  getWhatsAppGroup,
  addStudentToGroup,
  sendZoomLink,
  sendPaymentInfo,
};
