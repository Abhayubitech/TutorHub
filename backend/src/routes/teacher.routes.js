const express = require("express");
const router = express.Router();
const { createTeacherProfile , getAllTeacher,getTeacherById,updateTeacherProfile} = require("../controllers/teacher.controller");

router.post("/teacher-profile", createTeacherProfile);
router.get("fatch-teacher-profile",getAllTeacher)
router.get("fatch-teacher-profilebyid",getTeacherById)
router.put('/update-profile',updateTeacherProfile);

module.exports = router;
