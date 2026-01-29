const db = require("../config/db");

async function authenticateUser(username, password) {
  const [result] = await db.query(
    "SELECT * FROM users WHERE password = ? AND (email = ? OR phone = ?)",
    [password, username, username]
  );
  return result;
}

async function createUser(user) {
  const { name, email, password, role, phone } = user;

  const [result] = await db.query(
    "INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)",
    [name, email, password, role, phone]
  );
  return result;
}

async function checkEmail(email) {
  const [result] = await db.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );
  return result;
}

async function getUserById(userId) {
  const [result] = await db.query(
    "SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?",
    [userId]
  );
  return result;
}

async function getAllUsers() {
  const [result] = await db.query(
    "SELECT id, name, email, role, phone, created_at FROM users"
  );
  return result;
}

async function updateUser(userId, user) {
  const { name, email, role, phone } = user;

  const [result] = await db.query(
    "UPDATE users SET name=?, email=?, role=?, phone=? WHERE id=?",
    [name, email, role, phone, userId]
  );
  return result;
}

async function deleteUser(userId) {
  const [result] = await db.query(
    "DELETE FROM users WHERE id = ?",
    [userId]
  );
  return result;
}

async function getUsersByRole(role) {
  const [result] = await db.query(
    "SELECT id, name, email, phone FROM users WHERE role = ?",
    [role]
  );
  return result;
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