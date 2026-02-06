const crypto = require('crypto');

// In-memory OTP store (in production, use Redis or database)
const otpStore = new Map();

class OTPService {
  generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }

  storeOTP(email, otp) {
    // Store OTP with 10 minute expiry
    const expiryTime = Date.now() + (10 * 60 * 1000); // 10 minutes
    otpStore.set(email, {
      otp,
      expiryTime,
      attempts: 0
    });
  }

  verifyOTP(email, providedOTP) {
    const storedData = otpStore.get(email);
    
    if (!storedData) {
      return { valid: false, message: 'OTP not found or expired' };
    }

    // Check if OTP has expired
    if (Date.now() > storedData.expiryTime) {
      otpStore.delete(email);
      return { valid: false, message: 'OTP has expired' };
    }

    // Check attempts (max 3 attempts)
    if (storedData.attempts >= 3) {
      otpStore.delete(email);
      return { valid: false, message: 'Too many attempts. Please request a new OTP' };
    }

    // Increment attempts
    storedData.attempts++;

    // Verify OTP
    if (storedData.otp === providedOTP) {
      otpStore.delete(email);
      return { valid: true, message: 'OTP verified successfully' };
    }

    return { valid: false, message: 'Invalid OTP' };
  }

  // Clean up expired OTPs (call this periodically)
  cleanupExpiredOTPs() {
    const now = Date.now();
    for (const [email, data] of otpStore.entries()) {
      if (now > data.expiryTime) {
        otpStore.delete(email);
      }
    }
  }

  // For development/testing - send OTP to console
  sendOTP(email, otp) {
    console.log(`OTP for ${email}: ${otp}`);
    // In production, integrate with email service like Nodemailer, SendGrid, etc.
    // For now, we'll just log it to console for development
    return {
      success: true,
      message: 'OTP sent successfully (check console for development)',
      otp: otp // Only for development, remove in production
    };
  }
}

module.exports = new OTPService();
