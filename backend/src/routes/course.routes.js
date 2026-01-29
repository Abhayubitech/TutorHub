const express = require("express");
const router = express.Router();

router.get('/pending-requests', teacherController.getPendingRequests);


module.exports = router;