const teacherService = require("../services/teacher.service");

async function createTeacherProfile(req, res) {
    try {
        const profileData = { ...req.body, user_id: req.user.id };
        const result = await teacherService.createTeacherProfile(profileData);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getAllTeacher(req, res) {
    try {
        const teachers = await teacherService.getAllTeachers();
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getTeacherById(req, res) {
    try {
        const teacher = await teacherService.getTeacherById(req.params.id);
        res.json(teacher);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateTeacherProfile(req, res) {
    // Implement logic
    res.json({ message: "Update implemented soon" });
}

async function getPendingRequests(req, res) {
    try {
        const data = await teacherService.getPendingRequests();
        res.status(200).json({ pendingRequests: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { createTeacherProfile, getAllTeacher, getTeacherById, updateTeacherProfile, getPendingRequests };