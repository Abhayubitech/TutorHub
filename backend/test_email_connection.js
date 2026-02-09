require('dotenv').config();
const emailService = require('./src/services/email.service');

async function testConnection() {
  console.log('Testing email connection...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***SET***' : 'NOT SET');
  
  try {
    const result = await emailService.testEmailConnection();
    console.log('Connection test result:', result);
  } catch (error) {
    console.error('Connection test failed:', error);
  }
  
  process.exit(0);
}

testConnection();
