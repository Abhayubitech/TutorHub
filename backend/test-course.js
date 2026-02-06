const http = require('http');

function makeRequest(path, method, data, headers = {}, callback) {
  let jsonData = '';
  if (data) {
    jsonData = JSON.stringify(data);
  }
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: path,
    method: method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (jsonData) {
    options.headers['Content-Length'] = jsonData.length;
  }

  const req = http.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      try {
        const parsed = JSON.parse(responseData);
        callback(res.statusCode, parsed);
      } catch (e) {
        callback(res.statusCode, responseData);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  if (jsonData) {
    req.write(jsonData);
  }
  req.end();
}

console.log('🧪 Testing Course Creation Flow...\n');

// Test course data
const courseData = {
  subject: 'Mathematics',
  description: 'Advanced Mathematics Course',
  fee: 5000,
  mode: 'online',
  start_date: '2024-03-01',
  end_date: '2024-06-01',
  max_students: 30,
  schedule_days: 'Monday,Wednesday,Friday',
  schedule_time: '16:00-17:00',
  duration_per_class: 60
};

// First, let's try to create a user to get a token
console.log('1️⃣ Creating test user...');
makeRequest('/api/auth/signup', 'POST', {
  name: 'Test Teacher',
  email: 'teacher@example.com',
  password: 'password123',
  role: 'teacher',
  otp: '123456' // This will fail but let's see
}, {}, (status, response) => {
  console.log(`Status: ${status}`);
  console.log(`Response:`, response);
  
  if (status === 201 && response.success) {
    console.log('\n✅ User created successfully');
    // Test course creation with token
    testCourseCreation(response.token);
  } else {
    console.log('\n⚠️ User creation failed, testing course creation without auth...');
    testCourseCreation();
  }
});

function testCourseCreation(token = null) {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log('\n2️⃣ Testing course creation...');
  makeRequest('/api/teacher/courses', 'POST', courseData, headers, (status, response) => {
    console.log(`Status: ${status}`);
    console.log(`Response:`, response);
    
    if (status === 201 && response.success) {
      console.log('\n🎉 Course created successfully!');
      console.log(`Course ID: ${response.courseId}`);
      
      // Test getting the course
      console.log('\n3️⃣ Testing course retrieval...');
      makeRequest(`/api/teacher/courses/${response.courseId}`, 'GET', null, headers, (status, response) => {
        console.log(`Status: ${status}`);
        console.log(`Response:`, response);
        
        if (status === 200 && response.success) {
          console.log('\n✅ Course data retrieved successfully!');
          console.log('Course details:', response.course);
        } else {
          console.log('\n❌ Course retrieval failed');
        }
      });
    } else {
      console.log('\n❌ Course creation failed');
      console.log('This might be expected without proper authentication');
    }
  });
}
