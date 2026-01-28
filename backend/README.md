

## 📦 Tech Stack

- Node.js
- Express.js
- MySQL
- mysql2
- dotenv
- nodemon (development)

---
npm init -y
npm install express mysql2 dotenv jsonwebtoken
npm install nodemon --save-dev

## 📁 Project Structure

express-mysql-demo/
├── src/
│ ├── app.js
│ ├── server.js
│ ├── config/
│ │ └── db.js
│ ├── routes/
│ │ └── user.routes.js
│ ├── controllers/
│ │ └── user.controller.js
│ └── services/
│ └── user.service.js
├── .env
├── package.json
└── README.md


---

## ⚙️ Installation

```bash
git clone <your-repo-url>
cd express-mysql-demo
npm install

🔐 Environment Variables

Create a .env file in the root directory:

PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=tutor_hub
JWT_SECRET_KEY = gfg_jwt_secret_key
TOKEN_HEADER_KEY = gfg_token_header_key
🗄️ Database Setup
1️⃣ Users Table (Student & Teacher)

Instead of two separate tables, use one users table with roles (best practice).

users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'admin') NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)


👉 role decides whether the user is a student or teacher

2️⃣ Teacher Profile (Optional but Recommended)

Extra details only for teachers.

teacher_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    qualification VARCHAR(255),
    experience_years INT,
    bio TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
)

3️⃣ Course / Tuition Table

Teachers create courses or tuition sessions.

courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    description TEXT,
    fee DECIMAL(10,2),
    mode ENUM('online', 'offline') NOT NULL,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id)
)

4️⃣ Tuition Timing / Schedule Table

A course can have multiple timings.

course_schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    day ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'),
    start_time TIME,
    end_time TIME,
    FOREIGN KEY (course_id) REFERENCES courses(id)
)

5️⃣ Student Course Request Table

Students send requests to join a course.

course_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
)

6️⃣ Enrolled Students Table (After Approval)

Once approved, student is officially enrolled.

course_enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
)

🔗 Relationship Summary

User → Teacher → creates Courses

Course → has many Schedules

Student → sends Course Requests

Teacher → approves/rejects requests

Approved request → Enrollment