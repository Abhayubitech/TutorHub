const adminService = require("../services/admin.service");

async function getStudents(req, res) {
    try {
        const students = await adminService.getAllStudents();
        res.json(students);
    } catch (err) { res.status(500).json({ error: err.message }); }
}

async function getTeachers(req, res) {
    try {
        const teachers = await adminService.getAllTeachers();
        res.json(teachers);
    } catch (err) { res.status(500).json({ error: err.message }); }
}

async function getDashboardStats(req, res) {
    try {
        const stats = await adminService.getStats();
        res.json(stats);
    } catch (err) { res.status(500).json({ error: err.message }); }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        await adminService.deleteUser(id);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getProfile(req, res) {
    try {
        const userId = req.params.id;
        const admin = await adminService.getAdminProfile(userId);
        if (!admin) return res.status(404).json({ message: "Admin not found" });
        res.json(admin);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateProfile(req, res) {
    try {
        const { user_id, name, email, phone } = req.body;
        await adminService.updateAdminProfile(user_id, { name, email, phone });
        res.json({ message: "Profile updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getCourseDetails(req, res) {
    try {
        const { name, teacherId } = req.query;
        const course = await adminService.getCourseByNameAndTeacher(name, teacherId);
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function deleteAdminCourse(req, res) {
    try {
        const { id } = req.params;
        await adminService.deleteCourse(id);
        res.json({ message: "Course deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { 
    getStudents, 
    getTeachers, 
    getDashboardStats, 
    deleteUser, 
    getProfile,   
    updateProfile,
    getCourseDetails,
    deleteAdminCourse
};