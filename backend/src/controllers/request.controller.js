const requestService = require("../services/request.service");

async function createRequest(req, res) {
    try {
        const { course_id } = req.body;
        const result = await requestService.createRequest(req.user.id, course_id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getTeacherRequests(req, res) {
    try {
        if (req.user.role !== 'teacher') return res.status(403).json({ error: "Not authorized" });
        const requests = await requestService.getRequestsForTeacher(req.user.id);
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function handleRequest(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'approved' or 'rejected'
        if (req.user.role !== 'teacher') return res.status(403).json({ error: "Not authorized" });

        const result = await requestService.updateRequestStatus(id, status);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getMyEnrollments(req, res) {
    try {
        const enrollments = await requestService.getStudentEnrollments(req.user.id);
        res.json(enrollments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { createRequest, getTeacherRequests, handleRequest, getMyEnrollments };
