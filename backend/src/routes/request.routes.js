const express = require("express");
const router = express.Router();
const requestController = require("../controllers/request.controller");
const verifyToken = require("../middleware/auth.middleware");

router.post("/", verifyToken, requestController.createRequest);
router.get("/teacher", verifyToken, requestController.getTeacherRequests);
router.put("/:id", verifyToken, requestController.handleRequest);
router.get("/my-enrollments", verifyToken, requestController.getMyEnrollments);

module.exports = router;
