const express = require("express");
const teacherController = require("../controllers/teacher.controller");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/profile", auth, teacherController.addProfile);
router.put("/request/:requestId", auth, teacherController.respondToRequest);
router.get("/students/:teacher_id", auth, teacherController.viewMyStudents);

module.exports = router;