const express = require("express");
const { route } = require("./teacher.routes");
const router = express.Router();
const requestCourse = require('../controllers/student.controller')


router.post('/request-course',requestCourse.requestCourse)

module.exports = router