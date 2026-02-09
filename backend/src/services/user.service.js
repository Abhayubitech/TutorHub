const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

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
    const { name, email, phone, profile_pic, current_password, new_password } = userData;

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
    let nextEmail = email !== undefined ? email : existing.email;

    // Validate name if provided
    if (name !== undefined) validateName(nextName);
    
    // Validate phone if provided
    if (phone !== undefined) validatePhone(nextPhone);
    
    // Validate profile pic if provided
    if (profile_pic !== undefined && nextProfilePic && String(nextProfilePic).length > 255) {
      throw new Error('Profile picture URL must not exceed 255 characters');
    }

    // Handle email update
    if (email !== undefined && email !== existing.email) {
      validateEmail(email);
      
      // Check if email is already taken by another user
      const [emailCheck] = await db.query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, userId]
      );
      
      if (emailCheck.length > 0) {
        throw new Error('Email is already taken by another user');
      }
      
      nextEmail = email;
    }

    // Handle password update
    if (new_password !== undefined) {
      if (!current_password) {
        throw new Error('Current password is required to update password');
      }
      
      validatePassword(new_password);
      
      // Verify current password
      const [userWithPassword] = await db.query(
        'SELECT password FROM users WHERE id = ?',
        [userId]
      );
      
      const isValidCurrentPassword = await bcrypt.compare(
        current_password,
        userWithPassword[0].password
      );
      
      if (!isValidCurrentPassword) {
        throw new Error('Current password is incorrect');
      }
      
      // Hash new password
      const hashedNewPassword = await bcrypt.hash(new_password, 10);
      
      // Update user with new password
      await db.query(
        'UPDATE users SET name = ?, email = ?, phone = ?, profile_pic = ?, password = ? WHERE id = ?',
        [nextName, nextEmail, nextPhone, nextProfilePic, hashedNewPassword, userId]
      );
    } else {
      // Update user without password change
      await db.query(
        'UPDATE users SET name = ?, email = ?, phone = ?, profile_pic = ? WHERE id = ?',
        [nextName, nextEmail, nextPhone, nextProfilePic, userId]
      );
    }

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
    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );
    if (existingUsers.length === 0) {
      throw new Error('User not found');
    }

    await db.query('DELETE FROM users WHERE id = ?', [userId]);

    return {
      success: true,
      message: 'User deleted successfully'
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getUserByEmail(email) {
  try {
    validateEmail(email);
    
    const [users] = await db.query(
      "SELECT id, name, email, role FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return { success: false, message: "User not found" };
    }

    return { success: true, user: users[0] };
  } catch (err) {
    throw new Error(err.message);
  }
}

async function storePasswordResetToken(email, resetToken, expiryDate) {
  try {
    // Store token in a separate table or add to users table
    // For now, we'll add it to the users table (you may want to create a separate table)
    await db.query(
      "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
      [resetToken, expiryDate, email]
    );

    return { success: true, message: "Reset token stored" };
  } catch (err) {
    throw new Error(err.message);
  }
}

async function resetPassword(token, newPassword) {
  try {
    validatePassword(newPassword);

    // Find user with valid reset token
    const [users] = await db.query(
      "SELECT id, email FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()",
      [token]
    );

    if (users.length === 0) {
      return { success: false, message: "Invalid or expired reset token" };
    }

    const user = users[0];
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await db.query(
      "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?",
      [hashedPassword, user.id]
    );

    return { success: true, message: "Password reset successful" };
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
  getUserByEmail,
  storePasswordResetToken,
  resetPassword,
};