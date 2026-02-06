const db = require('../config/db');

class PaymentService {
  async createPaymentVerification(paymentData) {
    const connection = await db.getConnection();
    
    try {
      const [result] = await connection.execute(
        `INSERT INTO payment_verifications 
         (student_id, course_id, screenshot_path, payment_amount, payment_date, upi_transaction_id) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          paymentData.student_id,
          paymentData.course_id,
          paymentData.screenshot_path,
          paymentData.payment_amount,
          paymentData.payment_date,
          paymentData.upi_transaction_id
        ]
      );
      
      return {
        id: result.insertId,
        ...paymentData,
        status: 'pending'
      };
    } finally {
      connection.release();
    }
  }

  async getVerificationsByCourse(courseId, teacherId) {
    const connection = await db.getConnection();
    
    try {
      const [rows] = await connection.execute(
        `SELECT pv.*, u.name as student_name, u.email as student_email, c.subject as course_name
         FROM payment_verifications pv
         JOIN users u ON pv.student_id = u.id
         JOIN courses c ON pv.course_id = c.id
         WHERE pv.course_id = ? AND c.teacher_id = ?
         ORDER BY pv.created_at DESC`,
        [courseId, teacherId]
      );
      
      return rows;
    } finally {
      connection.release();
    }
  }

  async updateVerificationStatus(verificationId, status, teacherNotes, teacherId) {
    const connection = await db.getConnection();
    
    try {
      const [result] = await connection.execute(
        `UPDATE payment_verifications 
         SET status = ?, teacher_notes = ?, verified_by = ?, verified_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [status, teacherNotes, teacherId, verificationId]
      );
      
      if (result.affectedRows === 0) {
        throw new Error('Payment verification not found');
      }
      
      return { id: verificationId, status, teacher_notes: teacherNotes };
    } finally {
      connection.release();
    }
  }

  async getStudentPaymentStatus(studentId, courseId) {
    const connection = await db.getConnection();
    
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM payment_verifications WHERE student_id = ? AND course_id = ? ORDER BY created_at DESC',
        [studentId, courseId]
      );
      
      return rows.length > 0 ? rows[0] : null;
    } finally {
      connection.release();
    }
  }
}

module.exports = new PaymentService();
