const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// AUTH
router.post("/login", userController.authenticateUser);
router.post("/signup", userController.createUser);

// CHECK EMAIL (for signup validation)
router.get("/check-email/:email", userController.checkEmail);

// USERS
router.get("/", userController.getAllUsers);
router.get("/role/:role", userController.getUsersByRole);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
