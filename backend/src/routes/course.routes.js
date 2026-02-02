const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");


router.get('/course', courseController.course)
router.post('/request-enrollment', courseController.requestEnrollment);
router.get('/my-requests/courses/:id', courseController.getMyRequests);
// router.post('/signup', courseController.createUser)
module.exports = router;
