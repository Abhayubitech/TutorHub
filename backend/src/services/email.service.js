const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Create transporter using environment variables
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'tutorhub.abhaysir@gmail.com',
        pass: process.env.EMAIL_PASS || 'fallback-password'
      }
    });
  }

  async sendOTPEmail(email, otp) {
    try {
      // Check if email configuration is properly set
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your-app-password-here') {
        console.log(`Email not configured - OTP for ${email}: ${otp}`);
        return {
          success: true,
          message: 'OTP sent (console fallback - email not configured)',
          otp: otp // Return OTP for development/testing
        };
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'TutorHub - Email Verification OTP',
        html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 32px;">🎓 TutorHub</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Email Verification</p>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 10px; margin-top: 20px;">
              <h2 style="color: #333; margin-bottom: 20px;">Verify Your Email Address</h2>
              <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                Thank you for signing up with TutorHub! To complete your registration, please use the following One-Time Password (OTP) to verify your email address.
              </p>
              
              <div style="background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 30px;">
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your OTP Code:</p>
                <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 5px; margin: 10px 0;">
                  ${otp}
                </div>
              </div>
              
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  <strong>⚠️ Important:</strong> This OTP will expire in 10 minutes for security reasons.
                </p>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
                If you didn't request this verification, please ignore this email.
              </p>
              
              <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="margin: 0; color: #999; font-size: 12px;">
                  This is an automated message from TutorHub.<br>
                  © 2024 TutorHub. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`OTP email sent to ${email}: ${otp}`);
      
      return {
        success: true,
        message: 'OTP sent successfully via email',
        messageId: result.messageId
      };
    } catch (error) {
      console.error('Email sending error:', error);
      
      // Fallback to console for development
      console.log(`OTP for ${email}: ${otp} (email failed, console fallback)`);
      return {
        success: true,
        message: 'OTP sent (console fallback)',
        otp: otp // Return OTP for development/testing
      };
    }
  }

  async sendWelcomeEmail(email, name) {
    try {
      // Check if email configuration is properly set
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your-app-password-here') {
        console.log(`Email not configured - Welcome email skipped for ${email}`);
        return {
          success: true,
          message: 'Welcome email skipped (email not configured)'
        };
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to TutorHub! 🎓',
        html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 32px;">🎓 TutorHub</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Welcome to Learning Excellence</p>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 10px; margin-top: 20px;">
              <h2 style="color: #333; margin-bottom: 20px;">Welcome, ${name}! 🎉</h2>
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Thank you for joining TutorHub! Your account has been successfully created and verified.
              </p>
              
              <div style="background: white; border-left: 4px solid #667eea; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #333; margin-top: 0;">What's Next?</h3>
                <ul style="color: #666; line-height: 1.8;">
                  <li>Browse available courses and find your perfect match</li>
                  <li>Connect with expert teachers</li>
                  <li>Join WhatsApp groups for course updates</li>
                  <li>Track your learning progress</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:4200'}/dashboard" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                  Go to Dashboard
                </a>
              </div>
              
              <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="margin: 0; color: #999; font-size: 12px;">
                  This is an automated message from TutorHub.<br>
                  © 2024 TutorHub. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${email}`);
      
      return {
        success: true,
        message: 'Welcome email sent successfully'
      };
    } catch (error) {
      console.error('Welcome email error:', error);
      return {
        success: false,
        message: 'Failed to send welcome email'
      };
    }
  }

  async testEmailConnection() {
    try {
      // Check if email configuration is properly set
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your-app-password-here') {
        return { success: false, message: 'Email service not configured' };
      }

      await this.transporter.verify();
      return { success: true, message: 'Email service is connected' };
    } catch (error) {
      return { success: false, message: 'Email service connection failed', error: error.message };
    }
  }
}

module.exports = new EmailService();
