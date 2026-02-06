-- TutorHub Database Schema

-- Create Database
CREATE DATABASE IF NOT EXISTS tutor_hub;
USE tutor_hub;

-- 1️⃣ Users Table (Student, Teacher, Admin)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'admin') NOT NULL DEFAULT 'student',
    phone VARCHAR(20),
    profile_pic VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2️⃣ Teacher Profile (Optional but Recommended)
CREATE TABLE teacher_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    qualification VARCHAR(255),
    experience_years INT,
    bio TEXT,
    specializations VARCHAR(255),
    hourly_rate DECIMAL(10,2),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3️⃣ Course / Tuition Table
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    description TEXT,
    fee DECIMAL(10,2) NOT NULL,
    mode ENUM('online', 'offline', 'hybrid') NOT NULL,
    start_date DATE,
    end_date DATE,
    max_students INT DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4️⃣ Course Schedule Table
CREATE TABLE course_schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    day ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 5️⃣ Course Requests (Students requesting to join)
CREATE TABLE course_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response_date TIMESTAMP NULL,
    rejection_date TIMESTAMP NULL,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_request (student_id, course_id)
);

-- 6️⃣ Course Enrollments (After approval)
CREATE TABLE course_enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (student_id, course_id)
);

-- 7️⃣ WhatsApp Groups Table
CREATE TABLE whatsapp_groups (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    group_id VARCHAR(255) UNIQUE NOT NULL, -- WhatsApp group ID
    group_name VARCHAR(255) NOT NULL,
    invite_link VARCHAR(500),
    teacher_phone VARCHAR(20), -- Teacher's WhatsApp number
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 8️⃣ WhatsApp Group Members Table
CREATE TABLE whatsapp_group_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role ENUM('admin', 'member') DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES whatsapp_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_group_member (group_id, user_id)
);

-- 8️⃣ Payment Verifications Table
CREATE TABLE payment_verifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    screenshot_path VARCHAR(500) NOT NULL,
    payment_amount DECIMAL(10,2),
    payment_date DATE,
    upi_transaction_id VARCHAR(100),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    teacher_notes TEXT,
    verified_by INT, -- Teacher who verified
    verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_payment_request (student_id, course_id)
);

-- 9️⃣ Enhanced WhatsApp Groups Table (updated)
ALTER TABLE whatsapp_groups ADD COLUMN group_type ENUM('demo', 'approved') DEFAULT 'demo';
ALTER TABLE whatsapp_groups ADD COLUMN description TEXT;

-- 1️⃣0️⃣ WhatsApp Group Members Table (updated from existing)
CREATE TABLE whatsapp_group_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role ENUM('admin', 'member') DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES whatsapp_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_group_member (group_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_teacher_profiles_user_id ON teacher_profiles(user_id);
CREATE INDEX idx_courses_teacher_id ON courses(teacher_id);
CREATE INDEX idx_course_requests_student_id ON course_requests(student_id);
CREATE INDEX idx_course_requests_course_id ON course_requests(course_id);
CREATE INDEX idx_course_requests_status ON course_requests(status);
CREATE INDEX idx_enrollments_student_id ON course_enrollments(student_id);
CREATE INDEX idx_enrollments_course_id ON course_enrollments(course_id);
CREATE INDEX idx_whatsapp_groups_course_id ON whatsapp_groups(course_id);
CREATE INDEX idx_whatsapp_group_members_group_id ON whatsapp_group_members(group_id);
CREATE INDEX idx_whatsapp_group_members_user_id ON whatsapp_group_members(user_id);
CREATE INDEX idx_payment_verifications_student_id ON payment_verifications(student_id);
CREATE INDEX idx_payment_verifications_course_id ON payment_verifications(course_id);
CREATE INDEX idx_payment_verifications_status ON payment_verifications(status);
