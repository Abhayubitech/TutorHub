const db = require('./src/config/db');

async function runMigration() {
  try {
    console.log('Running password reset migration...');
    
    // Check if columns already exist
    const [columns] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'tutorhub' 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME IN ('reset_token', 'reset_token_expiry')
    `);
    
    const existingColumns = columns.map(col => col.COLUMN_NAME);
    
    // Add reset_token column if it doesn't exist
    if (!existingColumns.includes('reset_token')) {
      await db.query('ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) NULL');
      console.log('✅ Added reset_token column');
    } else {
      console.log('ℹ️ reset_token column already exists');
    }
    
    // Add reset_token_expiry column if it doesn't exist
    if (!existingColumns.includes('reset_token_expiry')) {
      await db.query('ALTER TABLE users ADD COLUMN reset_token_expiry DATETIME NULL');
      console.log('✅ Added reset_token_expiry column');
    } else {
      console.log('ℹ️ reset_token_expiry column already exists');
    }
    
    // Show updated table structure
    const [structure] = await db.query('DESCRIBE users');
    console.log('\n📋 Updated users table structure:');
    structure.forEach(col => {
      if (col.Field.includes('reset') || col.Field.includes('password') || col.Field.includes('email')) {
        console.log(`  ${col.Field}: ${col.Type}`);
      }
    });
    
    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
