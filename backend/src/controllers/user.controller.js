const userService = require("../services/user.service");

async function authenticateUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await userService.authenticateUser(email, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
}

async function createUser(req, res) {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const result = await userService.createUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const targetUserId = id === 'self' ? String(req.user?.id) : String(id);

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - Invalid token',
      });
    }

    const isAdmin = req.user.role === 'admin';
    const isSelf = String(req.user.id) === targetUserId;
    if (!isAdmin && !isSelf) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - You can only update your own profile',
      });
    }

    const result = await userService.updateUser(targetUserId, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const targetUserId = id === 'self' ? String(req.user?.id) : String(id);

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - Invalid token',
      });
    }

    const isAdmin = req.user.role === 'admin';
    const isSelf = String(req.user.id) === targetUserId;
    if (!isAdmin && !isSelf) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - You can only delete your own profile',
      });
    }

    const result = await userService.deleteUser(targetUserId);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  authenticateUser,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};