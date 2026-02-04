const courseService = require("../services/course.service");
const db = require("../config/db");

async function course(req, res) {
  try {

    // const {username,password} = req.body;
    const users = await courseService.course();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Get Student's Requests (My Requests Tab ke liye)
const getMyRequests =  async(req, res) => {

  try {
    const studentId = req.params.id;
    console.log("Student ID from Token:", studentId);

    const q = `
         SELECT 
                enrollments.id as request_id,
                enrollments.status,
                enrollments.request_date,
                courses.id as course_id,
                courses.title,
                courses.price,
                courses.subject,
    users.name as instructor_name
            FROM enrollments
            INNER JOIN courses ON courses.id= enrollments.course_id AND courses.created_by = enrollments.teacher_id
           INNER JOIN users ON users.id = enrollments.teacher_id
            WHERE enrollments.student_id = ?
            ORDER BY enrollments.request_date DESC
        `;

  let [result] = await db.query(q,[studentId]);
  console.log("My Requests Data:", result);
  return res.status(200).json(result);

  } catch (err) {
    console.log("Error in getMyRequests:", err);
    return res.status(500).json({ error: err.message });
  }
};

const requestEnrollment = async (req, res) => {
    try {
        // 1. Data Nikalo
        // Agar Token use kr rahe ho to: const studentId = req.user.id;
        // Agar Body se bhej rahe ho to:
        const { courseId, studentId } = req.body; 

        console.log("Step 1: Data Received", { courseId, studentId });

        if (!courseId || !studentId) {
            return res.status(400).json({ message: "Course ID and Student ID are required" });
        }

        // 2. Teacher Find Karo (Await use karein)
        const findTeacherQuery = "SELECT created_by FROM courses WHERE id = ?";
        
        // Note: mysql2/promise array return karta h: [rows, fields]
        const [teacherResult] = await db.query(findTeacherQuery, [courseId]);

        if (teacherResult.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        const teacherId = teacherResult[0].created_by;
        console.log("Step 2: Teacher Found ID:", teacherId);

        // 3. Duplicate Check Karo
        // Note: Table ka naam 'my_requests' h ya 'enrollments' wo check kr lena
        const checkQuery = "SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?";
        const [existingRequest] = await db.query(checkQuery, [studentId, courseId]);

        if (existingRequest.length > 0) {
            return res.status(400).json({ message: "Request already sent!" });
        }

        // 4. Insert Karo
        const insertQuery = `
            INSERT INTO enrollments (student_id, course_id, teacher_id, status) 
            VALUES (?, ?, ?, 'pending')
        `;
        
        await db.query(insertQuery, [studentId, courseId, teacherId]);

        console.log("Step 3: Insert Success");
        return res.status(200).json({ message: "Enrollment request sent successfully!" });

    } catch (err) {
        console.error("Error in requestEnrollment:", err);
        return res.status(500).json({ error: err.message });
    }
};
const getEnrolledCourses = async (req, res) => {
    try {
        const {studentId} = req.params; // Frontend se student ID aayegi

        if (!studentId) {
            return res.status(400).json({ error: "Student ID is required" });
        }

        // ✅ SQL Query: JOIN enrollments & courses table
        // Sirf wahi data layega jahan status 'accepted' hai
        const sql = `
            SELECT 
                c.id, 
                c.title, 
                c.subject, 
                c.price, 
                c.description, 
                c.created_by,
                e.request_date as enrollment_date,
                e.status
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.student_id = ? AND e.status = 'accepted'
        `;

        const [rows] = await db.query(sql, [studentId]);

        // Agar koi course nahi mila toh empty array bhejenge, error nahi
        res.status(200).json(rows);

    } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        res.status(500).json({ error: "Failed to fetch enrolled courses" });
    }
};
// async function  createUser (req, res) {
//   try {
//     const user = req.body
//     const result = await userService.createUser(user);
//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };



module.exports = { course, getMyRequests, requestEnrollment,getEnrolledCourses };