const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        await connection.query("ALTER TABLE teacher_profiles ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'");
        console.log("Schema updated successfully");
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log("Column already exists");
        } else {
            console.error(err);
        }
    } finally {
        await connection.end();
    }
}

run();
