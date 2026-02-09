const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");

// Public routes
router.post("/login", userController.authenticateUser);
router.post("/signup", userController.createUser);

// OTP routes
router.post("/send-otp", userController.sendOTP);
router.post("/verify-otp", userController.verifyOTP);

// Password reset routes
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);

// Protected routes
router.get("/:id", auth, userController.getUserById);
router.put("/:id", auth, userController.updateUser);
router.delete("/:id", auth, userController.deleteUser);

module.exports = router;
