const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

async function runMigration() {
  try {
    console.log('Connecting to database...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'tutor_hub'
    });

    console.log('Connected to database successfully');

    // Read the SQL script
    const sqlScript = fs.readFileSync(
      path.join(__dirname, '../scripts/add_rejection_date.sql'), 
      'utf8'
    );

    // Split the script into individual statements
    const statements = sqlScript
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => {
        // Remove comments and check if statement is not empty
        const cleanedStmt = stmt.replace(/--.*$/gm, '').trim();
        return cleanedStmt.length > 0 && !cleanedStmt.startsWith('--');
      });

    console.log(`Executing ${statements.length} SQL statements...`);

    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        await connection.execute(statement);
        console.log('✓ Success');
      }
    }

    console.log('Migration completed successfully!');
    await connection.end();

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
