const userService = require("../services/user.service");
const otpService = require("../services/otp.service");
const emailService = require("../services/email.service");
const crypto = require('crypto');

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
    const { name, email, password, role, phone, otp } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // If OTP is provided, verify it first
    if (otp) {
      const otpResult = otpService.verifyOTP(email, otp);
      if (!otpResult.valid) {
        return res.status(400).json({
          success: false,
          message: otpResult.message,
        });
      }
    }

    const result = await userService.createUser(req.body);
    
    // Send welcome email after successful registration
    if (result.success && result.user) {
      try {
        await emailService.sendWelcomeEmail(email, name);
      } catch (emailError) {
        console.error('Welcome email failed:', emailError);
        // Don't fail the registration if welcome email fails
      }
    }
    
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

async function sendOTP(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Generate and store OTP
    const otp = otpService.generateOTP();
    otpService.storeOTP(email, otp);

    // Send OTP via email (async)
    const result = await otpService.sendOTP(email, otp);
    
    res.json({
      success: true,
      message: result.message,
      // In development, return the OTP for testing
      otp: process.env.NODE_ENV === 'development' ? result.otp : undefined
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const result = otpService.verifyOTP(email, otp);
    
    if (result.valid) {
      res.json({
        success: true,
        message: result.message,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Check if user exists
    const user = await userService.getUserByEmail(email);
    if (!user.success) {
      // Don't reveal if email exists or not for security
      return res.json({
        success: true,
        message: "If an account with this email exists, a password reset link has been sent.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token in database (you'll need to add this to user service)
    await userService.storePasswordResetToken(email, resetToken, resetTokenExpiry);

    // Send password reset email
    const emailResult = await emailService.sendPasswordResetEmail(email, resetToken);
    
    res.json({
      success: true,
      message: emailResult.message,
      // In development, return reset token for testing
      resetToken: process.env.NODE_ENV === 'development' ? emailResult.resetToken : undefined
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required",
      });
    }

    // Validate password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Verify reset token and update password
    const result = await userService.resetPassword(token, newPassword);
    
    if (result.success) {
      res.json({
        success: true,
        message: "Password has been reset successfully. You can now login with your new password.",
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (err) {
    res.status(500).json({
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
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
};