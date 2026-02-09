const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Create transporter using Zoho SMTP
    this.transporter = nodemailer.createTransport({
      host: 'smtp.zoho.in',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER || 'ayushgoyal6@zohomail.in',
        pass: process.env.EMAIL_PASS || 'Ayushgoyal@0123'
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

  async sendContactEmail(name, email, subject, message) {
    try {
      // Check if email configuration is properly set
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your-app-password-here') {
        console.log(`Email not configured - Contact message from ${name} (${email}) - Subject: ${subject}: ${message}`);
        return {
          success: true,
          message: 'Contact message received (console fallback - email not configured)'
        };
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'ayushgoyal6@zohomail.in',
        subject: `TutorHub Contact: ${subject} - from ${name}`,
        html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 32px;">🎓 TutorHub</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">New Contact Form Message</p>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 10px; margin-top: 20px;">
              <h2 style="color: #333; margin-bottom: 20px;">📩 New Message Received</h2>
              
              <div style="background: white; border-left: 4px solid #667eea; padding: 20px; margin-bottom: 20px;">
                <div style="margin-bottom: 15px;">
                  <strong style="color: #333; display: block; margin-bottom: 5px;">From:</strong>
                  <span style="color: #666;">${name}</span>
                </div>
                
                <div style="margin-bottom: 15px;">
                  <strong style="color: #333; display: block; margin-bottom: 5px;">Email:</strong>
                  <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
                </div>
                
                <div style="margin-bottom: 15px;">
                  <strong style="color: #333; display: block; margin-bottom: 5px;">Subject:</strong>
                  <span style="color: #666; font-weight: 500;">${subject}</span>
                </div>
                
                <div>
                  <strong style="color: #333; display: block; margin-bottom: 10px;">Message:</strong>
                  <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; color: #666; line-height: 1.6; white-space: pre-wrap;">${message}</div>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:${email}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                  Reply to ${name}
                </a>
              </div>
              
              <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; margin-top: 30px;">
                <p style="margin: 0; color: #999; font-size: 12px;">
                  This message was sent from the TutorHub contact form.<br>
                  © 2024 TutorHub. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`Contact email sent from ${name} (${email}) - Subject: ${subject}`);
      
      return {
        success: true,
        message: 'Contact message sent successfully',
        messageId: result.messageId
      };
    } catch (error) {
      console.error('Contact email sending error:', error);
      
      // Fallback to console for development
      console.log(`Contact message from ${name} (${email}) - Subject: ${subject}: ${message} (email failed, console fallback)`);
      return {
        success: true,
        message: 'Contact message received (console fallback)'
      };
    }
  }

  async sendPasswordResetEmail(email, resetToken) {
    try {
      // Check if email configuration is properly set
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your-app-password-here') {
        console.log(`Email not configured - Password reset for ${email}: ${resetToken}`);
        return {
          success: true,
          message: 'Password reset email sent (console fallback - email not configured)',
          resetToken: resetToken
        };
      }

      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/reset-password?token=${resetToken}`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'TutorHub - Password Reset Request',
        html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 32px;">🎓 TutorHub</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Password Reset</p>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 10px; margin-top: 20px;">
              <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
              <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                We received a request to reset your password for your TutorHub account. Click the button below to create a new password.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                  Reset Password
                </a>
              </div>
              
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  <strong>⚠️ Important:</strong> This password reset link will expire in 1 hour for security reasons.
                </p>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
                If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
              </p>
              
              <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <p style="margin: 0; color: #666; font-size: 12px;">
                  <strong>Alternative:</strong> If the button doesn't work, copy and paste this link into your browser:<br>
                  <span style="word-break: break-all; color: #667eea;">${resetLink}</span>
                </p>
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

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
      
      return {
        success: true,
        message: 'Password reset email sent successfully',
        messageId: result.messageId
      };
    } catch (error) {
      console.error('Password reset email error:', error);
      
      // Fallback to console for development
      console.log(`Password reset for ${email}: ${resetToken} (email failed, console fallback)`);
      return {
        success: true,
        message: 'Password reset email sent (console fallback)',
        resetToken: resetToken
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
