require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./src/config/db');

async function createUser() {
  try {
    console.log('Creating user account...');
    
    const email = 'ayushgoya6@zohomail.in';
    const password = '987654321';
    const role = 'teacher';
    
    // Check if user already exists
    const [existingUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    
    if (existingUser.length > 0) {
      console.log('❌ User already exists with this email');
      process.exit(0);
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, role]
    );
    
    console.log('✅ User created successfully!');
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}`);
    console.log(`  Role: ${role}`);
    console.log(`  User ID: ${result.insertId}`);
    
    console.log('\n🎉 You can now login with these credentials!');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    process.exit(1);
  }
}

createUser();
