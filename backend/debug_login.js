require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./src/config/db');

async function debugLogin() {
  try {
    console.log('Debugging login issue...');
    
    const email = 'ayushgoya6@zohomail.in';
    const password = '987654321';
    
    // Check if user exists
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    console.log(`\n🔍 Searching for user: ${email}`);
    
    if (users.length === 0) {
      console.log('❌ User not found in database');
      process.exit(0);
    }
    
    const user = users[0];
    console.log('✅ User found:');
    console.log(`  ID: ${user.id}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Has Password: ${user.password ? 'Yes' : 'No'}`);
    console.log(`  Password Hash: ${user.password ? user.password.substring(0, 20) + '...' : 'N/A'}`);
    
    // Test password verification
    if (user.password) {
      console.log(`\n🔐 Testing password: "${password}"`);
      
      try {
        const isValid = await bcrypt.compare(password, user.password);
        console.log(`  Password Match: ${isValid ? '✅ Yes' : '❌ No'}`);
        
        if (!isValid) {
          console.log('\n🔍 Testing with common passwords...');
          const testPasswords = ['123456', 'password', 'admin', '123456789'];
          
          for (const testPass of testPasswords) {
            const testValid = await bcrypt.compare(testPass, user.password);
            if (testValid) {
              console.log(`  ✅ Found matching password: "${testPass}"`);
              break;
            }
          }
        }
      } catch (error) {
        console.log(`  ❌ Password verification error: ${error.message}`);
      }
    }
    
    // Check backend login logic
    console.log('\n🔍 Simulating backend login process...');
    
    // This simulates what happens in user.controller.js login function
    const [loginCheck] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (loginCheck.length === 0) {
      console.log('❌ Backend would return: User not found');
    } else {
      const loginUser = loginCheck[0];
      
      if (!loginUser.password) {
        console.log('❌ Backend would return: Invalid credentials (no password)');
      } else {
        try {
          const passwordMatch = await bcrypt.compare(password, loginUser.password);
          if (passwordMatch) {
            console.log('✅ Backend would return: Login successful');
            console.log(`  User role: ${loginUser.role}`);
          } else {
            console.log('❌ Backend would return: Invalid credentials (wrong password)');
          }
        } catch (error) {
          console.log('❌ Backend would return: Server error during password verification');
        }
      }
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Debug error:', error.message);
    process.exit(1);
  }
}

debugLogin();
