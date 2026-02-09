const http = require('http');

// Test complete OTP flow
const email = 'test@example.com';

console.log('Testing OTP flow...');

// Step 1: Send OTP
const sendOtpData = JSON.stringify({ email: email });

const sendOtpOptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/send-otp',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': sendOtpData.length
  }
};

const sendOtpReq = http.request(sendOtpOptions, (res) => {
  console.log(`Send OTP Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Send OTP Response:', data);
    
    try {
      const response = JSON.parse(data);
      if (response.success && response.otp) {
        console.log(`\nUsing OTP: ${response.otp} for verification...`);
        
        // Step 2: Verify OTP
        const verifyOtpData = JSON.stringify({ 
          email: email, 
          otp: response.otp.toString() 
        });
        
        const verifyOtpOptions = {
          hostname: 'localhost',
          port: 3000,
          path: '/api/auth/verify-otp',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': verifyOtpData.length
          }
        };
        
        const verifyOtpReq = http.request(verifyOtpOptions, (verifyRes) => {
          console.log(`\nVerify OTP Status: ${verifyRes.statusCode}`);
          
          let verifyData = '';
          verifyRes.on('data', (chunk) => {
            verifyData += chunk;
          });
          
          verifyRes.on('end', () => {
            console.log('Verify OTP Response:', verifyData);
            
            try {
              const verifyResponse = JSON.parse(verifyData);
              if (verifyResponse.success) {
                console.log('\n✅ OTP verification successful!');
              } else {
                console.log('\n❌ OTP verification failed:', verifyResponse.message);
              }
            } catch (e) {
              console.log('\n❌ Failed to parse verify response:', e.message);
            }
          });
        });
        
        verifyOtpReq.on('error', (e) => {
          console.error(`Problem with verify request: ${e.message}`);
        });
        
        verifyOtpReq.write(verifyOtpData);
        verifyOtpReq.end();
        
      } else {
        console.log('\n❌ Failed to get OTP from response');
      }
    } catch (e) {
      console.log('\n❌ Failed to parse send response:', e.message);
    }
  });
});

sendOtpReq.on('error', (e) => {
  console.error(`Problem with send request: ${e.message}`);
});

sendOtpReq.write(sendOtpData);
sendOtpReq.end();
