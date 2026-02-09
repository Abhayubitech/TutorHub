require('dotenv').config();
const emailService = require('./src/services/email.service');

async function testEmail() {
  console.log('Testing email service...');
  
  try {
    // Test password reset email
    const result = await emailService.sendPasswordResetEmail('ayushgoyal0123@gmail.com', 'test-token-123');
    console.log('Email result:', result);
  } catch (error) {
    console.error('Email test failed:', error);
  }
  
  process.exit(0);
}

testEmail();
