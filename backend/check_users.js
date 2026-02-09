require('dotenv').config();
const db = require('./src/config/db');

async function checkUsers() {
  try {
    console.log('Checking users in database...');
    
    // Get all users
    const [users] = await db.query('SELECT id, email, role, created_at FROM users ORDER BY created_at DESC');
    
    console.log('\n📋 All Users in Database:');
    if (users.length === 0) {
      console.log('❌ No users found in database');
    } else {
      users.forEach(user => {
        console.log(`  📧 ${user.email} (ID: ${user.id}, Role: ${user.role}, Created: ${user.created_at})`);
      });
    }
    
    // Check specific email
    const emailToCheck = 'ayushgoya6@zohomail.in';
    const [specificUser] = await db.query('SELECT * FROM users WHERE email = ?', [emailToCheck]);
    
    console.log(`\n🔍 Checking for email: ${emailToCheck}`);
    if (specificUser.length > 0) {
      console.log('✅ User found:');
      console.log(`  Email: ${specificUser[0].email}`);
      console.log(`  Role: ${specificUser[0].role}`);
      console.log(`  Has Password: ${specificUser[0].password ? 'Yes' : 'No'}`);
      console.log(`  Has Reset Token: ${specificUser[0].reset_token ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ User not found in database');
    }
    
    // Check for similar emails
    const [similarUsers] = await db.query('SELECT email FROM users WHERE email LIKE ?', ['%ayush%']);
    console.log('\n🔍 Users with "ayush" in email:');
    if (similarUsers.length === 0) {
      console.log('❌ No users found with "ayush" in email');
    } else {
      similarUsers.forEach(user => {
        console.log(`  📧 ${user.email}`);
      });
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error checking users:', error.message);
    process.exit(1);
  }
}

checkUsers();
