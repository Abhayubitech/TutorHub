const db = require('../config/db'); // Database connection

// 1. Get All Courses Created by a Teacher
exports.getTeacherCourses = async (req, res) => {
  try {
    const { teacherId } = req.params;

    // ✅ SQL Query: Select courses created by this teacher
    const sql = `SELECT * FROM courses WHERE created_by = ?`;
    
    // Database Call
    const [courses] = await db.query(sql, [teacherId]);

    // Data Formatting
    const formattedCourses = courses.map(course => ({
      id: course.id,
      title: course.title,
      subject: course.subject,
      price: course.price,
      description: course.description,
      instructor_name: 'You' 
    }));

    res.status(200).json(formattedCourses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching courses', error });
  }
};

// 2. Get Pending Student Requests for a Teacher
exports.getTeacherRequests = async (req, res) => {
  try {
    const { teacherId } = req.params;

    // ✅ SQL Query: JOIN Enrollments + Courses + Users (Students)
    // Hame wo requests chahiye jo 'pending' hain aur us course ke liye hain jiska instructor logged-in teacher hai.
    const sql = `
  SELECT 
    enrollments.id as request_id,
    enrollments.status,
    enrollments.request_date,
    courses.id as course_id,
    courses.title as course_title,
    courses.subject,
    courses.price,
    users.name as student_name,   -- Fetching Student Name for the Teacher
    users.email as student_email  -- Optional: If you need to show student contact
FROM enrollments
INNER JOIN courses ON courses.id = enrollments.course_id
INNER JOIN users ON users.id = enrollments.student_id -- Join with Student
WHERE courses.created_by = 2 and enrollments.status = "pending" -- Replace '?' with the logged-in Teacher's ID
ORDER BY enrollments.request_date DESC;
    `;

    const [requests] = await db.query(sql, [teacherId]);
// console.log(requests);

    // Data Formatting
    const formattedRequests = requests.map(req => ({
      id: req.request_id,
      student_name: req.student_name,
      course_title: req.course_title,
      date: req.request_date
    }));

    // console.log(formattedRequests);
    

    res.status(200).json(formattedRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching requests', error });
  }
};


exports.createCourse = async (req, res) => {
    try {
        // 1. Extract data (Added 'schedule', removed 'instructor_name')
        const { title, subject, price, schedule, description, created_by } = req.body;

        // 2. Validation
        if (!title || !subject || !price || !created_by) {
            return res.status(400).json({ error: "Please provide all required fields." });
        }

        // 3. SQL Query matching your table image
        const sql = `
            INSERT INTO courses (title, subject, price, schedule, description, created_by, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;

        // 4. Map values strictly to the order in the SQL
        // If 'schedule' is optional, we pass null or an empty string
        const values = [title, subject, price, schedule || null, description, created_by];

        // 5. Execute
        const [result] = await db.query(sql, values);

        // 6. Success Response
        res.status(201).json({
            id: result.insertId,
            title,
            subject,
            price,
            schedule,
            description,
            created_by,
            created_at: new Date()
        });

    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ error: "Failed to create course. Please try again." });
    }
};


// Update Course Function
exports.updateCourse = async (req, res) => {
    try {
        const courseId = req.params.id; // URL se ID lena (e.g. /api/courses/5)
        const { title, subject, price, schedule, description } = req.body[0];
        const created_by = req.body[1];
        console.log(created_by);
        

        // 1. Check valid ID
        if (!courseId) {
            return res.status(400).json({ error: "Course ID is required" });
        }

        // 2. SQL Update Query
        const sql = `
            UPDATE courses 
            SET title = ?, subject = ?, price = ?, schedule = ?, description = ?, created_by = ?
            WHERE id = ?
        `;

        const values = [title, subject, price, schedule, description, created_by,courseId];

        // 3. Execute Query
        const [result] = await db.query(sql, values);

        // 4. Check if course existed
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Course not found or no changes made." });
        }

        // 5. Success Response
        res.status(200).json({
            message: "Course updated successfully",
            id: courseId,
            title,
            subject,
            price,
            schedule,
            description
        });

    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ error: "Failed to update course." });
    }
};

// Update Request Status (Approve/Reject)
exports.updateRequestStatus = async (req, res) => {
    try {
        const { requestId } = req.params; // Request ID
        const { status } = req.body; // 'accepted' or 'rejected'

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        // SQL Query to update status
        const sql = `UPDATE enrollments SET status = ? WHERE id = ?`;

        const [result] = await db.query(sql, [status, requestId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Request not found" });
        }

        res.status(200).json({ message: `Request ${status} successfully` });

    } catch (error) {
        console.error("Error updating request:", error);
        res.status(500).json({ error: "Failed to update request status" });
    }
};

