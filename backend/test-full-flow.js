const http = require('http');

function makeRequest(path, data, callback) {
  const jsonData = JSON.stringify(data);
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': jsonData.length
    }
  };

  const req = http.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      callback(res.statusCode, JSON.parse(responseData));
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.write(jsonData);
  req.end();
}

console.log('🧪 Testing OTP Flow...\n');

// Step 1: Send OTP
makeRequest('/api/auth/send-otp', { email: 'test@example.com' }, (status, response) => {
  console.log('1️⃣ Send OTP Response:');
  console.log(`Status: ${status}`);
  console.log(`Response:`, response);
  
  if (response.success && response.otp) {
    const otp = response.otp;
    console.log(`\n✅ OTP received: ${otp}`);
    
    // Step 2: Verify OTP immediately
    setTimeout(() => {
      makeRequest('/api/auth/verify-otp', { email: 'test@example.com', otp: otp }, (status, response) => {
        console.log('\n2️⃣ Verify OTP Response:');
        console.log(`Status: ${status}`);
        console.log(`Response:`, response);
        
        if (response.success) {
          console.log('\n🎉 OTP verification successful!');
        } else {
          console.log('\n❌ OTP verification failed!');
        }
      });
    }, 1000); // Small delay to ensure OTP is stored
  } else {
    console.log('\n❌ Failed to get OTP');
  }
});
