const express = require("express");
const teacherController = require("../controllers/teacher.controller");
const auth = require("../middleware/auth.middleware");
const upload = require('../middleware/upload.middleware');

const router = express.Router();

router.post('/profile', [auth, upload.single('profile_pic')], teacherController.addProfile);

router.put("/request/:requestId", auth, teacherController.respondToRequest);

router.get("/students/:teacher_id", auth, teacherController.viewMyStudents);

router.get('/profile/:user_id', auth, teacherController.getProfile);

module.exports = router;