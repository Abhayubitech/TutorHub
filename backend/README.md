

# TutorHub Backend API

A comprehensive backend API for a tutoring platform built with Node.js, Express, and MySQL.

## 📦 Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Database
- **mysql2** - MySQL client
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variables
- **nodemon** - Development server (auto-reload)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- MySQL (v5.7+)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Configure your `.env` file with your database credentials:
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=tutor_hub
JWT_SECRET_KEY=your_super_secret_key_here_change_this
```

5. Initialize the database:
   - Open MySQL and run the SQL script:
   ```bash
   mysql -u root -p < database.sql
   ```

6. Start the server:
```bash
npm start
```

The API will be available at `http://localhost:3000`

## 📁 Project Structure

```
backend/
├── src/
│ ├── app.js              # Express app configuration
│ ├── server.js           # Server entry point
│ ├── config/
│ │ └── db.js            # Database connection
│ ├── routes/
│ │ ├── user.routes.js
│ │ ├── teacher.routes.js
│ │ ├── student.routes.js
│ │ └── course.routes.js
│ ├── controllers/
│ │ ├── user.controller.js
│ │ ├── teacher.controller.js
│ │ ├── student.controller.js
│ │ └── course.controller.js
│ ├── services/
│ │ ├── user.service.js
│ │ ├── teacher.service.js
│ │ ├── student.service.js
│ │ └── course.service.js
│ └── middleware/
│ └── auth.middleware.js
├── database.sql          # Database schema
├── .env.example          # Environment variables example
├── package.json
└── README.md
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "phone": "1234567890"
  }
}
```

### Signup
```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student", // or "teacher"
  "phone": "1234567890"
}
```

### Protected Routes
Include the token in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📚 API Endpoints

### User Routes
- `POST /api/auth/login` - Login
- `POST /api/auth/signup` - Register
- `GET /api/auth/:id` - Get user (protected)
- `PUT /api/auth/:id` - Update user (protected)
- `DELETE /api/auth/:id` - Delete user (protected)

### Teacher Routes (Protected)
- `GET /api/teacher/profile` - Get teacher profile
- `PUT /api/teacher/profile` - Update teacher profile
- `GET /api/teacher/courses` - Get teacher's courses
- `POST /api/teacher/courses` - Create course
- `PUT /api/teacher/courses/:courseId` - Update course
- `DELETE /api/teacher/courses/:courseId` - Delete course
- `POST /api/teacher/courses/:courseId/schedule` - Add course schedule
- `GET /api/teacher/enrollment-requests` - Get enrollment requests
- `PUT /api/teacher/enrollment-requests/:requestId` - Approve/reject request
- `GET /api/teacher/courses/:courseId/students` - Get enrolled students

### Student Routes
- `GET /api/student/courses` - Get all courses (public)
- `GET /api/student/courses/:courseId` - Get course details (public)
- `GET /api/student/courses/search?query=...` - Search courses (public)
- `GET /api/student/teachers` - Get all teachers (public)
- `GET /api/student/teachers/:teacherId` - Get teacher details (public)
- `POST /api/student/enroll` - Request enrollment (protected)
- `GET /api/student/my-requests` - Get my requests (protected)
- `GET /api/student/my-enrollments` - Get my enrollments (protected)
- `DELETE /api/student/requests/:requestId` - Cancel request (protected)

### Course Routes
- `GET /api/courses` - Get all courses

## 🗄️ Database Schema

The database consists of 6 main tables:

1. **users** - All users (students, teachers, admins)
2. **teacher_profiles** - Additional teacher information
3. **courses** - Tuition courses/classes
4. **course_schedules** - Class schedules
5. **course_requests** - Student enrollment requests
6. **course_enrollments** - Confirmed enrollments

See `database.sql` for complete schema.

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Protected routes with middleware
- ✅ Input validation
- ✅ Error handling
- ✅ CORS enabled

## 📝 Environment Variables

```
PORT=3000                          # Server port
DB_HOST=localhost                  # Database host
DB_USER=root                       # Database user
DB_PASSWORD=yourpassword           # Database password
DB_NAME=tutor_hub                  # Database name
JWT_SECRET_KEY=your_secret_key     # JWT secret key
```

## 🛠️ Development

Run the server in development mode with auto-reload:
```bash
npm start
```

## 📦 Dependencies

See `package.json` for all dependencies and versions.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

ISC

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