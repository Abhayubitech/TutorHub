const nodemailer = require('nodemailer');

class UniversalEmailService {
  constructor() {
    // Multiple email service configurations
    this.emailConfigs = {
      gmail: {
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER || 'tutorhub.abhaysir@gmail.com',
          pass: process.env.GMAIL_PASS || 'your-gmail-app-password'
        }
      },
      outlook: {
        service: 'outlook',
        auth: {
          user: process.env.OUTLOOK_USER,
          pass: process.env.OUTLOOK_PASS
        }
      },
      zoho: {
        host: 'smtp.zoho.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.ZOHO_USER,
          pass: process.env.ZOHO_PASS
        }
      },
      // Fallback to a reliable service
      sendgrid: {
        service: 'sendgrid',
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY
        }
      }
    };
  }

  // Detect email provider from email address
  detectEmailProvider(email) {
    const domain = email.toLowerCase().split('@')[1];
    
    if (domain.includes('gmail.com') || domain.includes('googlemail.com')) {
      return 'gmail';
    } else if (domain.includes('outlook.com') || domain.includes('hotmail.com') || domain.includes('live.com')) {
      return 'outlook';
    } else if (domain.includes('zoho.com')) {
      return 'zoho';
    } else {
      // Default to Gmail for other domains
      return 'gmail';
    }
  }

  // Create transporter for specific provider
  createTransporter(provider) {
    const config = this.emailConfigs[provider];
    if (!config) {
      console.log(`No configuration for provider: ${provider}, falling back to Gmail`);
      return nodemailer.createTransport(this.emailConfigs.gmail);
    }
    return nodemailer.createTransport(config);
  }

  async sendOTPEmail(email, otp) {
    try {
      const provider = this.detectEmailProvider(email);
      const transporter = this.createTransporter(provider);
      
      // Check if the provider is configured
      const config = this.emailConfigs[provider];
      if (!config.auth.pass || config.auth.pass.includes('your-') || config.auth.pass.includes('password')) {
        console.log(`${provider} not configured - OTP for ${email}: ${otp}`);
        return {
          success: true,
          message: `OTP sent (console fallback - ${provider} not configured)`,
          otp: otp
        };
      }

      const mailOptions = {
        from: config.auth.user,
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

      const result = await transporter.sendMail(mailOptions);
      console.log(`OTP email sent to ${email} via ${provider}: ${otp}`);
      
      return {
        success: true,
        message: `OTP sent successfully via ${provider}`,
        messageId: result.messageId,
        provider: provider
      };
    } catch (error) {
      console.error(`Email sending error:`, error);
      
      // Fallback to console
      console.log(`OTP for ${email}: ${otp} (email failed, console fallback)`);
      return {
        success: true,
        message: 'OTP sent (console fallback)',
        otp: otp
      };
    }
  }

  async testAllProviders() {
    const results = {};
    
    for (const [provider, config] of Object.entries(this.emailConfigs)) {
      try {
        if (!config.auth.pass || config.auth.pass.includes('your-') || config.auth.pass.includes('password')) {
          results[provider] = { success: false, message: 'Not configured' };
          continue;
        }
        
        const transporter = this.createTransporter(provider);
        await transporter.verify();
        results[provider] = { success: true, message: 'Connected' };
      } catch (error) {
        results[provider] = { success: false, message: error.message };
      }
    }
    
    return results;
  }
}

module.exports = new UniversalEmailService();
