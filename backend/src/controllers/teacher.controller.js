const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User'); // Assuming you have a User model

// 1. Get All Courses Created by a Teacher
exports.getTeacherCourses = async (req, res) => {
  try {
    const { teacherId } = req.params;

    // Fetch courses where instructor matches teacherId
    const courses = await Course.find({ instructor: teacherId });

    // Map to match Angular interface if needed (e.g. _id -> id)
    const formattedCourses = courses.map(course => ({
      id: course._id,
      title: course.title,
      subject: course.subject,
      price: course.price,
      description: course.description,
      instructor_name: 'You' // Or fetch from User model
    }));

    res.status(200).json(formattedCourses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error });
  }
};

// 2. Get Pending Student Requests for a Teacher
exports.getTeacherRequests = async (req, res) => {
  try {
    const { teacherId } = req.params;

    // Find Enrollments where instructor is this teacher AND status is 'pending'
    const requests = await Enrollment.find({ 
      instructor: teacherId, 
      status: 'pending' 
    })
    .populate('student', 'name email') // Get Student Name
    .populate('course', 'title');      // Get Course Title

    // Format data for Angular component
    const formattedRequests = requests.map(req => ({
      id: req._id,
      student_name: req.student.name,
      course_title: req.course.title,
      date: req.requested_at // Angular pipe | date handles formatting
    }));

    res.status(200).json(formattedRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error });
  }
};

// 3. Approve or Reject a Request
exports.updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body; // Expecting { status: 'approved' } or { status: 'rejected' }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status update' });
    }

    const updatedRequest = await Enrollment.findByIdAndUpdate(
      requestId,
      { status: status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({ message: `Request ${status} successfully`, data: updatedRequest });
  } catch (error) {
    res.status(500).json({ message: 'Error updating request', error });
  }
};