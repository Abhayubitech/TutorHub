const db = require('../config/db');

class WhatsAppService {
  // Create WhatsApp group for a course
  async createGroup(groupData) {
    const connection = await db.getConnection();
    
    try {
      const [result] = await connection.execute(
        `INSERT INTO whatsapp_groups 
         (course_id, group_name, invite_link, group_type, description, teacher_phone) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          groupData.course_id,
          groupData.group_name,
          groupData.invite_link,
          groupData.group_type || 'demo',
          groupData.description || '',
          groupData.teacher_phone
        ]
      );
      
      return {
        id: result.insertId,
        ...groupData
      };
    } finally {
      connection.release();
    }
  }

  // Get WhatsApp group by course and type
  async getGroupByCourse(courseId, groupType = 'demo') {
    const connection = await db.getConnection();
    
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM whatsapp_groups WHERE course_id = ? AND group_type = ? AND is_active = TRUE',
        [courseId, groupType]
      );
      
      return rows.length > 0 ? rows[0] : null;
    } finally {
      connection.release();
    }
  }

  // Get all groups for a course
  async getGroupsByCourse(courseId) {
    const connection = await db.getConnection();
    
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM whatsapp_groups WHERE course_id = ? AND is_active = TRUE ORDER BY group_type',
        [courseId]
      );
      
      return rows;
    } finally {
      connection.release();
    }
  }

  // Update WhatsApp group
  async updateGroup(groupId, updateData) {
    const connection = await db.getConnection();
    
    try {
      const fields = [];
      const values = [];
      
      if (updateData.group_name) {
        fields.push('group_name = ?');
        values.push(updateData.group_name);
      }
      if (updateData.invite_link) {
        fields.push('invite_link = ?');
        values.push(updateData.invite_link);
      }
      if (updateData.description) {
        fields.push('description = ?');
        values.push(updateData.description);
      }
      if (updateData.teacher_phone) {
        fields.push('teacher_phone = ?');
        values.push(updateData.teacher_phone);
      }
      
      if (fields.length === 0) {
        throw new Error('No fields to update');
      }
      
      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(groupId);
      
      const [result] = await connection.execute(
        `UPDATE whatsapp_groups SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
      
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  // Delete WhatsApp group (soft delete)
  async deleteGroup(groupId) {
    const connection = await db.getConnection();
    
    try {
      const [result] = await connection.execute(
        'UPDATE whatsapp_groups SET is_active = FALSE WHERE id = ?',
        [groupId]
      );
      
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  // Add member to WhatsApp group
  async addMember(groupId, userId, phone, role = 'member') {
    const connection = await db.getConnection();
    
    try {
      const [result] = await connection.execute(
        'INSERT INTO whatsapp_group_members (group_id, user_id, phone, role) VALUES (?, ?, ?, ?)',
        [groupId, userId, phone, role]
      );
      
      return {
        id: result.insertId,
        group_id: groupId,
        user_id: userId,
        phone,
        role
      };
    } finally {
      connection.release();
    }
  }

  // Get members of a WhatsApp group
  async getGroupMembers(groupId) {
    const connection = await db.getConnection();
    
    try {
      const [rows] = await connection.execute(
        `SELECT wgm.*, u.name, u.email, u.role as user_role 
         FROM whatsapp_group_members wgm 
         JOIN users u ON wgm.user_id = u.id 
         WHERE wgm.group_id = ? 
         ORDER BY wgm.joined_at`,
        [groupId]
      );
      
      return rows;
    } finally {
      connection.release();
    }
  }

  // Remove member from WhatsApp group
  async removeMember(groupId, userId) {
    const connection = await db.getConnection();
    
    try {
      const [result] = await connection.execute(
        'DELETE FROM whatsapp_group_members WHERE group_id = ? AND user_id = ?',
        [groupId, userId]
      );
      
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  // Check if user is member of group
  async isMemberOfGroup(groupId, userId) {
    const connection = await db.getConnection();
    
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM whatsapp_group_members WHERE group_id = ? AND user_id = ?',
        [groupId, userId]
      );
      
      return rows.length > 0;
    } finally {
      connection.release();
    }
  }
}

module.exports = new WhatsAppService();
