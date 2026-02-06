const crypto = require('crypto');
const emailService = require('./email.service');
const universalEmailService = require('./email.service.universal');

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

  // Send OTP via email
  async sendOTP(email, otp) {
    try {
      // Try universal email service first (supports multiple providers)
      const universalResult = await universalEmailService.sendOTPEmail(email, otp);
      
      if (universalResult.success && !universalResult.message.includes('console fallback')) {
        console.log(`OTP sent successfully to ${email} via universal service`);
        return {
          success: true,
          message: 'OTP sent successfully via email',
          provider: universalResult.provider,
          // Only return OTP in development for testing
          otp: process.env.NODE_ENV === 'development' ? otp : undefined
        };
      }
      
      // Fallback to original email service
      const result = await emailService.sendOTPEmail(email, otp);
      
      if (result.success) {
        console.log(`OTP sent successfully to ${email} via fallback service`);
        return {
          success: true,
          message: 'OTP sent successfully via email',
          // Only return OTP in development for testing
          otp: process.env.NODE_ENV === 'development' ? otp : undefined
        };
      } else {
        // Final fallback to console
        console.log(`OTP for ${email}: ${otp} (all email services failed, console fallback)`);
        return {
          success: true,
          message: 'OTP sent (console fallback)',
          otp: otp // Return OTP for development/testing
        };
      }
    } catch (error) {
      console.error('OTP sending error:', error);
      // Always fallback to console
      console.log(`OTP for ${email}: ${otp} (error fallback)`);
      return {
        success: true,
        message: 'OTP sent (console fallback)',
        otp: otp // Return OTP for development/testing
      };
    }
  }
}

module.exports = new OTPService();
