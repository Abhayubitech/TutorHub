const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/login", userController.authenticateUser);
router.post("/signup", userController.createUser);

router.get("/check-email/:email", userController.checkEmail);

router.get("/", userController.getAllUsers);
router.get("/role/:role", userController.getUsersByRole);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;