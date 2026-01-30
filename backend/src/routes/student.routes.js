const express = require("express");
const studentController = require("../controllers/student.controller");
const auth = require("../middleware/auth.middleware");

const router = express.Router();


router.post("/apply", auth, studentController.applyForCourse);



router.get("/requests/:student_id", auth, studentController.getMyRequests);


router.post("/profile", auth, studentController.addProfile);

router.get("/profile/:user_id", auth, studentController.getProfile);

module.exports = router;