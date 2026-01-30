const studentService = require("../services/student.service");

async function applyForCourse(req, res) {
  try {
    const { student_id, course_id } = req.body;
    const result = await studentService.applyForCourse(student_id, course_id);
    res.json({ message: "Request sent successfully", requestId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getMyRequests(req, res) {
  try {
    const { student_id } = req.params; 
    const requests = await studentService.getStudentRequests(student_id);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function addProfile(req, res) {
  try {
    const profileData = req.body;
    
    if (!profileData.user_id) {
        return res.status(400).json({ error: "User ID is required" });
    }

    const result = await studentService.createStudentProfile(profileData);
    res.json({ message: "Student profile updated", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getProfile(req, res) {
    try {
        const { user_id } = req.params;
        const profile = await studentService.getStudentProfile(user_id);
        
        if(!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { 
    applyForCourse, 
    getMyRequests,  
    addProfile,     
    getProfile      
};