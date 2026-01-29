const db = require("../config/db");

exports.requestCourse = async (req, res) => {
  try {
    const { course_Id, Student_Id } = req.body;

    console.log(course_Id, Student_Id);

    const query = `
      INSERT INTO course_requests (student_id, course_id)
      VALUES (?, ?)
    `;

    const [result] = await db.query(query, [Student_Id, course_Id]);

    return res.status(200).json({
      msg: "Course requested successfully",
      requestId: result.insertId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Something went wrong",
      error: error.message
    });
  }
};
