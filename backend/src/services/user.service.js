const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ✅ VALIDATION FUNCTIONS
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new Error('Invalid email format. Example: user@example.com');
  }
};

const validatePassword = (password) => {
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
  if (password.length > 100) {
    throw new Error('Password must not exceed 100 characters');
  }
};

const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    throw new Error('Name is required and cannot be empty');
  }
  if (name.length > 100) {
    throw new Error('Name must not exceed 100 characters');
  }
  if (/\d/.test(name)) {
    throw new Error('Name cannot contain numbers');
  }
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    throw new Error('Name can only contain letters, spaces, hyphens, and apostrophes');
  }
};

const validatePhone = (phone) => {
  if (!phone) return; // Phone is optional
  if (phone.length > 20) {
    throw new Error('Phone number must not exceed 20 characters');
  }
  if (!/^[\d+\-\s()]+$/.test(phone)) {
    throw new Error('Phone number can only contain digits, +, -, spaces, and parentheses');
  }
  if (!/\d/.test(phone)) {
    throw new Error('Phone number must contain at least one digit');
  }
};

const validateRole = (role) => {
  const validRoles = ['student', 'teacher', 'admin'];
  if (!validRoles.includes(role)) {
    throw new Error('Invalid role. Must be student, teacher, or admin');
  }
};

async function authenticateUser(email, password) {
  try {
    // ✅ Validate inputs
    validateEmail(email);
    if (!password || password.length === 0) {
      throw new Error('Password is required');
    }

    const [users] = await db.query(
      "SELECT id, name, email, role, phone FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      throw new Error("User not found");
    }

    const user = users[0];
    const [userWithPassword] = await db.query(
      "SELECT password FROM users WHERE id = ?",
      [user.id]
    );

    const isValidPassword = await bcrypt.compare(
      password,
      userWithPassword[0].password
    );

    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    return {
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

async function createUser(user) {
  try {
    const { name, email, password, role, phone } = user;

    // ✅ Validate all inputs
    validateName(name);
    validateEmail(email);
    validatePassword(password);
    validateRole(role);
    validatePhone(phone);

    // Check if user already exists
    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, role || "student", phone]
    );

    // Generate token
    const token = jwt.sign(
      { id: result.insertId, email, role: role || "student" },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    return {
      success: true,
      message: "User created successfully",
      token,
      user: {
        id: result.insertId,
        name,
        email,
        role: role || "student",
        phone,
      },
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getUserById(userId) {
  try {
    const [users] = await db.query(
      "SELECT id, name, email, role, phone, profile_pic, created_at FROM users WHERE id = ?",
      [userId]
    );

    if (users.length === 0) {
      throw new Error("User not found");
    }

    return users[0];
  } catch (err) {
    throw new Error(err.message);
  }
}

async function updateUser(userId, userData) {
  try {
    const { name, phone, profile_pic } = userData;

    const [existingUsers] = await db.query(
      'SELECT id, name, email, role, phone, profile_pic FROM users WHERE id = ?',
      [userId]
    );
    if (existingUsers.length === 0) {
      throw new Error('User not found');
    }

    const existing = existingUsers[0];

    const nextName = name !== undefined ? name : existing.name;
    const nextPhone = phone !== undefined ? phone : existing.phone;
    const nextProfilePic = profile_pic !== undefined ? profile_pic : existing.profile_pic;

    if (name !== undefined) validateName(nextName);
    if (phone !== undefined) validatePhone(nextPhone);
    if (profile_pic !== undefined && nextProfilePic && String(nextProfilePic).length > 255) {
      throw new Error('Profile picture URL must not exceed 255 characters');
    }

    await db.query(
      'UPDATE users SET name = ?, phone = ?, profile_pic = ? WHERE id = ?',
      [nextName, nextPhone, nextProfilePic, userId]
    );

    const [updatedUsers] = await db.query(
      'SELECT id, name, email, role, phone, profile_pic, created_at FROM users WHERE id = ?',
      [userId]
    );

    return {
      success: true,
      message: 'User updated successfully',
      user: updatedUsers[0],
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

async function deleteUser(userId) {
  try {
    await db.query("DELETE FROM users WHERE id = ?", [userId]);

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  authenticateUser,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};