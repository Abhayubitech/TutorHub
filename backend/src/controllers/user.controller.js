const userService = require("../services/user.service");

async function authenticateUser(req, res) {
  try {
    const { username, password } = req.body;
    const users = await userService.authenticateUser(username, password);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createUser(req, res) {
  try {
    const user = req.body;
    const result = await userService.createUser(user);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function checkEmail(req, res) {
  try {
    const { email } = req.params;
    const result = await userService.checkEmail(email);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const result = await userService.getUserById(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAllUsers(req, res) {
  try {
    const result = await userService.getAllUsers();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const user = req.body;
    const result = await userService.updateUser(id, user);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getUsersByRole(req, res) {
  try {
    const { role } = req.params;
    const result = await userService.getUsersByRole(role);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  authenticateUser,
  createUser,
  checkEmail,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  getUsersByRole
};