const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function authenticateUser(email, password) {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ? OR phone = ?",
    [email, email]
  );

  if (rows.length === 0) {
    throw new Error("User not found");
  }

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // Generate Token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET_KEY || "gfg_jwt_secret_key",
    { expiresIn: "2h" }
  );

  // Return user info (excluding password) and token
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
}

async function createUser(user) {
  const { name, email, password, role, phone } = user;

  // Check if user already exists
  const [existingUser] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (existingUser.length > 0) {
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const [result] = await db.query(
    "INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)",
    [name, email, hashedPassword, role, phone]
  );

  return { id: result.insertId, name, email, role, phone };
}

module.exports = { authenticateUser, createUser };