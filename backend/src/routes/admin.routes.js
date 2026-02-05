const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller"); 
const auth = require("../middleware/auth.middleware");
const checkAdmin = require("../middleware/admin.middleware");
const multer = require('multer');
const upload = multer(); 

router.get("/stats", [auth, checkAdmin], adminController.getDashboardStats);
router.get("/students", [auth, checkAdmin], adminController.getStudents);
router.get("/teachers", [auth, checkAdmin], adminController.getTeachers);
router.delete("/users/:id", [auth, checkAdmin], adminController.deleteUser);
router.get("/profile/:id", [auth, checkAdmin], adminController.getProfile);
router.post("/profile", [auth, checkAdmin, upload.none()], adminController.updateProfile);

router.get("/course-details", [auth, checkAdmin], adminController.getCourseDetails);
router.delete("/courses/:id", [auth, checkAdmin], adminController.deleteAdminCourse);

module.exports = router;