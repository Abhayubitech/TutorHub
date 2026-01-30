const teacherService = require("../services/teacher.service");

async function addProfile(req, res) {
  try {
    const profileData = req.body;
    
    if (!profileData.user_id) {
        return res.status(400).json({ error: "User ID is required" });
    }

    const result = await teacherService.createTeacherProfile(profileData);
    res.json({ message: "Profile updated successfully", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function respondToRequest(req, res) {
  try {
    const { requestId } = req.params; 
    const { status } = req.body;      

    if (status !== 'approved' && status !== 'rejected') {
        return res.status(400).json({ error: "Status must be 'approved' or 'rejected'" });
    }

    await teacherService.updateRequestStatus(requestId, status);
    res.json({ message: `Request ${status} successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function viewMyStudents(req, res) {
    try {
        const { teacher_id } = req.params;
        const students = await teacherService.getMyStudents(teacher_id);
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { addProfile, respondToRequest, viewMyStudents };