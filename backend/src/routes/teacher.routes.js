const express = require("express");
const router = express.Router();
const { createTeacherProfile, getAllTeacher, getTeacherById, updateTeacherProfile, getPendingRequests } = require("../controllers/teacher.controller");

router.post("/teacher-profile", createTeacherProfile);
router.get("/fatch-teacher-profile", getAllTeacher);
router.get("/fatch-teacher-profilebyid", getTeacherById);
router.put('/update-profile', updateTeacherProfile);
router.get('/pending-requests', getPendingRequests);

module.exports = router;
