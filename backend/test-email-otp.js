const emailService = require('./src/services/email.service');
const otpService = require('./src/services/otp.service');

async function testEmailOTP() {
    console.log('=== Email OTP Test ===\n');
    
    // Test 1: Check email service configuration
    console.log('1. Testing email service configuration...');
    const emailTest = await emailService.testEmailConnection();
    console.log('Email service status:', emailTest);
    console.log('');
    
    // Test 2: Generate and test OTP for your email
    const testEmail = 'ayushgoyal0123@gmail.com';
    console.log(`2. Testing OTP generation and sending to ${testEmail}...`);
    
    // Generate OTP
    const otp = otpService.generateOTP();
    console.log('Generated OTP:', otp);
    
    // Store OTP
    otpService.storeOTP(testEmail, otp);
    console.log('OTP stored in memory');
    
    // Send OTP
    const sendResult = await otpService.sendOTP(testEmail, otp);
    console.log('Send result:', sendResult);
    console.log('');
    
    // Test 3: Verify OTP
    console.log('3. Testing OTP verification...');
    const verifyResult = otpService.verifyOTP(testEmail, otp);
    console.log('Verification result:', verifyResult);
    console.log('');
    
    // Test 4: Test with wrong OTP
    console.log('4. Testing with wrong OTP...');
    const wrongOTP = '000000';
    const wrongResult = otpService.verifyOTP(testEmail, wrongOTP);
    console.log('Wrong OTP result:', wrongResult);
    console.log('');
    
    console.log('=== Test Complete ===');
    console.log('\nNext steps:');
    console.log('1. If email service shows "not configured", update EMAIL_PASS in .env file');
    console.log('2. Generate a Gmail App Password and replace "your-app-password"');
    console.log('3. Run this test again to verify emails are being sent');
    console.log('4. Check your email inbox for the OTP');
}

// Run the test
testEmailOTP().catch(console.error);
