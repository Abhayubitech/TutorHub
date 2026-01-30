const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const auth = require("../middleware/auth.middleware");

router.use(auth);

router.get("/users", adminController.getUsers);
router.get("/recent-users", adminController.getRecentUsers);
router.put("/users/:userId", adminController.updateUser);
router.delete("/users/:userId", adminController.deleteUser);
router.get("/courses", adminController.getAllCourses);
router.get("/manage", adminController.getManageOverview);

module.exports = router;
