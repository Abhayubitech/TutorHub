const universalEmailService = require('./src/services/email.service.universal');

async function testUniversalEmail() {
    console.log('=== Universal Email Service Test ===\n');
    
    // Test 1: Check all email providers
    console.log('1. Testing all email providers...');
    const providerTests = await universalEmailService.testAllProviders();
    console.log('Provider Status:', providerTests);
    console.log('');
    
    // Test 2: Test different email domains
    const testEmails = [
        'ayushgoyal0123@gmail.com',
        'ayushgoyal6@zohomail.in',
        'test@outlook.com',
        'user@yahoo.com'
    ];
    
    console.log('2. Testing OTP for different email domains...');
    
    for (const email of testEmails) {
        console.log(`\nTesting ${email}:`);
        
        // Detect provider
        const provider = universalEmailService.detectEmailProvider(email);
        console.log(`  Detected provider: ${provider}`);
        
        // Generate test OTP
        const testOTP = '123456';
        
        // Send test OTP
        const result = await universalEmailService.sendOTPEmail(email, testOTP);
        console.log(`  Result: ${result.message}`);
        
        if (result.provider) {
            console.log(`  Sent via: ${result.provider}`);
        }
    }
    
    console.log('\n=== Test Complete ===');
    console.log('\nTo configure universal email support:');
    console.log('1. Copy .env.universal to .env');
    console.log('2. Set up app passwords for each email service you want to use');
    console.log('3. At minimum, configure GMAIL_USER and GMAIL_PASS');
    console.log('4. For Zoho emails, configure Zoho credentials');
    console.log('5. Run this test again to verify all providers work');
}

// Run the test
testUniversalEmail().catch(console.error);
