const mysql = require('mysql2/promise');

// Load environment variables
require('dotenv').config();

async function addRejectionDateColumn() {
  try {
    console.log('Connecting to database...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'tutor_hub'
    });

    console.log('Connected to database successfully');

    // Add the rejection_date column
    console.log('Adding rejection_date column...');
    await connection.execute(
      "ALTER TABLE course_requests ADD COLUMN rejection_date TIMESTAMP NULL AFTER response_date"
    );
    console.log('✓ rejection_date column added');

    // Add index for better performance
    console.log('Adding index for rejection_date...');
    await connection.execute(
      "CREATE INDEX idx_course_requests_rejection_date ON course_requests(rejection_date)"
    );
    console.log('✓ Index added');

    // Update existing rejected requests
    console.log('Updating existing rejected requests...');
    await connection.execute(
      "UPDATE course_requests SET rejection_date = response_date WHERE status = 'rejected' AND response_date IS NOT NULL"
    );
    console.log('✓ Existing rejected requests updated');

    console.log('Migration completed successfully!');
    await connection.end();

  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('✓ rejection_date column already exists');
    } else {
      console.error('Migration failed:', error);
      process.exit(1);
    }
  }
}

addRejectionDateColumn();
