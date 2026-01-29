require('dotenv').config();
const db = require('../src/config/db');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    // simple helper
    const hash = async (p) => await bcrypt.hash(p, 10);

    // Clear minimal safety - do NOT drop tables
    console.log('Seeding users...');

    // Insert admin
    const adminPass = await hash('adminpass');
    const [adminResult] = await db.query(
      `INSERT INTO users (name,email,password,role,phone) VALUES (?, ?, ?, 'admin', ?)`,
      ['Admin User', 'admin@example.com', adminPass, '+911234567890']
    );

    // Insert teacher
    const teacherPass = await hash('teacherpass');
    const [teacherResult] = await db.query(
      `INSERT INTO users (name,email,password,role,phone) VALUES (?, ?, ?, 'teacher', ?)`,
      ['Teacher One', 'teacher1@example.com', teacherPass, '+911112223334']
    );

    // Insert student
    const studentPass = await hash('studentpass');
    const [studentResult] = await db.query(
      `INSERT INTO users (name,email,password,role,phone) VALUES (?, ?, ?, 'student', ?)`,
      ['Student One', 'student1@example.com', studentPass, '+919998887776']
    );

    const teacherId = teacherResult.insertId;

    console.log('Seeding teacher profile...');
    await db.query(
      `INSERT INTO teacher_profiles (user_id, qualification, experience_years, bio, specializations, hourly_rate, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [teacherId, 'MSc Mathematics', 5, 'Experienced math tutor for high-school students', 'Algebra, Calculus', 500.00, 1]
    );

    console.log('Seeding courses...');
    await db.query(
      `INSERT INTO courses (teacher_id, subject, description, fee, mode, start_date, end_date, max_students) VALUES
      (?, 'Algebra Basics', 'Foundations of algebra for beginners', 1000.00, 'online', '2026-02-01', '2026-05-01', 20),
      (?, 'Calculus I', 'Intro to limits, derivatives and applications', 1500.00, 'offline', '2026-03-01', '2026-06-01', 15)`,
      [teacherId, teacherId]
    );

    console.log('Seeding completed.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message || err);
    process.exit(1);
  }
}

seed();
