const requestService = require("../services/request.service");

async function requestCourse(req, res) {
    try {
        const { course_id } = req.body;
        if (!course_id) {
            return res.status(400).json({ error: "course_id is required" });
        }
        const result = await requestService.createRequest(req.user.id, course_id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { requestCourse };