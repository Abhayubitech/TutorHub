const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const auth = require("../middleware/auth.middleware");
const checkAdmin = require("../middleware/admin.middleware");

router.get("/students", [auth, checkAdmin], adminController.getStudents);
router.get("/teachers", [auth, checkAdmin], adminController.getTeachers);
router.get("/stats", [auth, checkAdmin], adminController.getDashboardStats);

module.exports = router;