const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");



exports.registerUser = async (data) => {
  const { name, email, password, role, phone } = data;

  if (!name || !email || !password || !role || !phone) {
    throw new Error('All fields are required');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    throw new Error('Invalid phone number');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const allowedRoles = ['student', 'teacher', 'admin'];
  if (!allowedRoles.includes(role)) {
    throw new Error('Invalid role');
  }

  const [existingUsers] = await db.query(
    `SELECT id FROM users WHERE email = ? OR phone = ?`,
    [email, phone]
  );

  if (existingUsers.length > 0) {
    throw new Error('User already exists with this email or phone');
  }

  const hashedPassword = await bcrypt.hash(password,10);

  const [result] = await db.query(
    `INSERT INTO users (name, email, password, role, phone)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, hashedPassword, role, phone]
  );

  return {
    message: 'User registered successfully',
    userId: result.insertId,
  };
};


exports.loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }

  const [users] = await db.query(
    `SELECT id, password, role FROM users WHERE email = ?`,
    [email]
  );

  if (users.length === 0) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, users[0].password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { id: users[0].id, role: users[0].role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1d' }
  );

  return {
    message: 'Login successful',
    token,
  };
};


exports.createCourse = async (teacherId, data) => {
  const { subject, description, fee, mode, start_date, end_date } = data;

  const [result] = await db.query(
    `INSERT INTO courses 
     (teacher_id, subject, description, fee, mode, start_date, end_date)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [teacherId, subject, description, fee, mode, start_date, end_date],
  );

  return {
    message: "Course created successfully",
    courseId: result.insertId,
  };
};

exports.requestCourse = async ({ student_id, course_id }) => {
  await db.query(
    `INSERT INTO course_requests (student_id, course_id)
     VALUES (?, ?)`,
    [student_id, course_id],
  );

  return { message: "Course request sent" };
};

exports.approveRequest = async ({ request_id }) => {
  const [reqData] = await db.query(
    `SELECT * FROM course_requests WHERE id = ?`,
    [request_id],
  );

  if (!reqData.length) {
    throw new Error("Request not found");
  }

  await db.query(
    `UPDATE course_requests SET status = 'approved' WHERE id = ?`,
    [request_id],
  );

  await db.query(
    `INSERT INTO course_enrollments (student_id, course_id)
     VALUES (?, ?)`,
    [reqData[0].student_id, reqData[0].course_id],
  );

  return { message: "Request approved & student enrolled" };
};

exports.getAllCourses = async () => {
  const [rows] = await db.query(
    `SELECT 
        c.id,
        c.subject,
        c.description,
        c.fee,
        c.mode,
        c.start_date,
        c.end_date,
        u.name AS teacher_name
     FROM courses c
     JOIN users u ON c.teacher_id = u.id
     ORDER BY c.created_at DESC`,
  );
  return rows;
};

exports.rejectRequest = async ({ request_id }) => {
  const [rows] = await db.query(`SELECT * FROM course_requests WHERE id = ?`, [
    request_id,
  ]);

  if (!rows.length) {
    throw new Error("Request not found");
  }

  await db.query(
    `UPDATE course_requests
     SET status = 'rejected'
     WHERE id = ?`,
    [request_id],
  );

  return { message: "Course request rejected" };
};

exports.updateCourse = async (teacherId, courseId, data) => {
  const [courses] = await db.query(
    `SELECT id FROM courses WHERE id = ? AND teacher_id = ?`,
    [courseId, teacherId],
  );

  if (!courses.length) {
    throw new Error("Unauthorized: not your course");
  }

  const { subject, description, fee, mode, start_date, end_date } = data;

  await db.query(
    `UPDATE courses
     SET subject = ?, description = ?, fee = ?, mode = ?,
         start_date = ?, end_date = ?
     WHERE id = ?`,
    [subject, description, fee, mode, start_date, end_date, courseId],
  );

  return { message: "Course updated successfully" };
};

exports.deleteCourse = async (teacherId, courseId) => {
  const [courses] = await db.query(
    `SELECT id FROM courses WHERE id = ? AND teacher_id = ?`,
    [courseId, teacherId],
  );

  if (!courses.length) {
    throw new Error("Unauthorized: not your course");
  }

  await db.query(`DELETE FROM course_schedules WHERE course_id = ?`, [
    courseId,
  ]);
  await db.query(`DELETE FROM course_requests WHERE course_id = ?`, [courseId]);
  await db.query(`DELETE FROM course_enrollments WHERE course_id = ?`, [
    courseId,
  ]);

  await db.query(`DELETE FROM courses WHERE id = ?`, [courseId]);

  return { message: "Course deleted successfully" };
};
