const userService = require("../services/user.service");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const bcrypt = require("bcryptjs");

async function authenticateUser(req, res) {
  try {
    const { email, password } = req.body;
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
        return res.status(400).json({ message: "User not found" });
    }
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
        { id: user.id, role: user.role, name: user.name }, 
        "YOUR_SECRET_KEY", 
        { expiresIn: "1h" }
    );
    res.header("x-auth-token", token).json({ 
        message: "Login successful", 
        token: token,
        user: { id: user.id, name: user.name, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function createUser(req, res) {
  try {
    const userData = req.body;
    const result = await userService.createUser(userData);
    res.status(201).json({ message: "User registered successfully", userId: result.insertId });
  } catch (err) {
    const statusCode = err.status || 500;
    res.status(statusCode).json({ message: err.message });
  }
};

module.exports = { authenticateUser, createUser };