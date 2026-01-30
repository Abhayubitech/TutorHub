const adminService = require("../services/admin.service");

async function getStudents(req, res) {
    try {
        const students = await adminService.getAllStudents();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getTeachers(req, res) {
    try {
        const teachers = await adminService.getAllTeachers();
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getDashboardStats(req, res) {
    try {
        const stats = await adminService.getStats();
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getStudents, getTeachers, getDashboardStats };