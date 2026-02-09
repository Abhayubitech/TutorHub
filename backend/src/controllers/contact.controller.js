const emailService = require('../services/email.service');

class ContactController {
  async submitContact(req, res) {
    try {
      const { name, email, subject, message } = req.body;

      // Validate input
      if (!name || !email || !subject || !message) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required'
        });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Valid email is required'
        });
      }

      // Name validation
      const nameRegex = /^[a-zA-Z\s'-]*$/;
      if (!nameRegex.test(name) || name.length > 33) {
        return res.status(400).json({
          success: false,
          message: 'Name must contain only letters, spaces, hyphens, and apostrophes (max 33 characters)'
        });
      }

      // Subject validation
      if (subject.length > 100) {
        return res.status(400).json({
          success: false,
          message: 'Subject must be maximum 100 characters'
        });
      }

      // Send contact email to ayushgoyal6@zohomail.in
      const emailResult = await emailService.sendContactEmail(name, email, subject, message);

      if (emailResult.success) {
        return res.status(200).json({
          success: true,
          message: 'Thank you for contacting us! We will get back to you soon.'
        });
      } else {
        return res.status(500).json({
          success: false,
          message: 'Failed to send message. Please try again later.'
        });
      }
    } catch (error) {
      console.error('Contact form error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new ContactController();
