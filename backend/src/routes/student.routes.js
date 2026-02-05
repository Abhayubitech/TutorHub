const express = require("express");
const studentController = require("../controllers/student.controller");
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware"); 

const router = express.Router();

router.post("/profile", [auth, upload.single("profile_pic")], studentController.addProfile);

router.get("/profile/:user_id", auth, studentController.getProfile);

router.post("/apply", auth, studentController.applyForCourse);
router.get("/requests/:student_id", auth, studentController.getMyRequests);

module.exports = router;