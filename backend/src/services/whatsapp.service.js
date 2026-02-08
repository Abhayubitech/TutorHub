const db = require('../config/db');

// Only load WhatsApp Web.js if enabled
let Client, qrcode;
if (process.env.WHATSAPP_ENABLED === 'true') {
  try {
    const whatsapp = require('whatsapp-web.js');
    Client = whatsapp.Client;
    qrcode = require('qrcode-terminal');
  } catch (error) {
    console.error('❌ WhatsApp Web.js dependencies not found. Install with: npm install whatsapp-web.js qrcode-terminal');
    console.log('📱 Running in database-only mode');
  }
}

class WhatsAppService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.initializeClient();
  }

  initializeClient() {
    // Only initialize if WhatsApp is enabled and dependencies are available
    if (process.env.WHATSAPP_ENABLED !== 'true' || !Client) {
      console.log('📱 WhatsApp integration is disabled or dependencies not available');
      return;
    }

    this.client = new Client({
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    this.client.on('qr', (qr) => {
      console.log('📱 WhatsApp QR Code received, please scan:');
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      console.log('✅ WhatsApp client is ready!');
      this.isConnected = true;
    });

    this.client.on('authenticated', () => {
      console.log('🔐 WhatsApp client authenticated!');
    });

    this.client.on('auth_failure', (msg) => {
      console.error('❌ WhatsApp Authentication failure:', msg);
      this.isConnected = false;
    });

    this.client.on('disconnected', (reason) => {
      console.log('📱 WhatsApp client disconnected:', reason);
      this.isConnected = false;
    });

    this.client.initialize().catch(err => {
      console.error('❌ Failed to initialize WhatsApp client:', err);
    });
  }

  async createGroup(courseId, courseName, teacherPhone) {
    try {
      if (!this.isConnected) {
        throw new Error('WhatsApp client not connected');
      }

      const groupName = `${courseName} - TutorHub`;
      
      // Create group with teacher as first participant
      const group = await this.client.createGroup(groupName, [`${teacherPhone}@c.us`]);
      
      // Save group info to database
      const connection = await db.getConnection();
      try {
        const [result] = await connection.execute(
          `INSERT INTO whatsapp_groups (course_id, group_id, group_name, teacher_phone, is_active) 
           VALUES (?, ?, ?, ?, ?)`,
          [courseId, group.gid._serialized, groupName, teacherPhone, true]
        );

        // Add teacher as group member in database
        await connection.execute(
          `INSERT INTO whatsapp_group_members (group_id, user_id, phone, role) 
           VALUES (?, (SELECT id FROM users WHERE phone = ?), ?, 'admin')`,
          [result.insertId, teacherPhone, teacherPhone]
        );

        return {
          success: true,
          groupId: group.gid._serialized,
          groupName: groupName,
          dbId: result.insertId
        };
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error creating WhatsApp group:', error);
      throw error;
    }
  }

  async getGroupInviteLink(groupId) {
    try {
      if (!this.isConnected) {
        throw new Error('WhatsApp client not connected');
      }

      const inviteLink = await this.client.getGroupInviteLink(groupId);
      
      // Update invite link in database
      const connection = await db.getConnection();
      try {
        await connection.execute(
          'UPDATE whatsapp_groups SET invite_link = ? WHERE group_id = ?',
          [inviteLink, groupId]
        );
      } finally {
        connection.release();
      }

      return inviteLink;
    } catch (error) {
      console.error('Error getting group invite link:', error);
      throw error;
    }
  }

  async addParticipantToGroup(groupId, phoneNumber) {
    try {
      if (!this.isConnected) {
        throw new Error('WhatsApp client not connected');
      }

      const participantId = `${phoneNumber}@c.us`;
      await this.client.getGroupById(groupId).addParticipants([participantId]);
      
      return { success: true };
    } catch (error) {
      console.error('Error adding participant to group:', error);
      throw error;
    }
  }

  async sendMessageToGroup(groupId, message) {
    try {
      if (!this.isConnected) {
        throw new Error('WhatsApp client not connected');
      }

      await this.client.sendMessage(groupId, message);
      return { success: true };
    } catch (error) {
      console.error('Error sending message to group:', error);
      throw error;
    }
  }

  async sendZoomLink(groupId, zoomLink) {
    const message = `🎥 *Zoom Meeting Link*\n\nJoin your class using the link below:\n${zoomLink}\n\n⏰ Please join 5 minutes before the scheduled time.\n📚 TutorHub Team`;
    return this.sendMessageToGroup(groupId, message);
  }

  async sendPaymentInfo(groupId, paymentDetails) {
    const message = `💳 *Payment Information*\n\nCourse Fee: ₹${paymentDetails.fee}\nPayment Method: ${paymentDetails.method}\nDue Date: ${paymentDetails.dueDate}\n\nPlease complete the payment to continue accessing the course.\n📚 TutorHub Team`;
    return this.sendMessageToGroup(groupId, message);
  }

  async getGroupInfo(courseId) {
    try {
      const connection = await db.getConnection();
      try {
        const [rows] = await connection.execute(
          'SELECT * FROM whatsapp_groups WHERE course_id = ? AND is_active = ?',
          [courseId, true]
        );
        
        return rows.length > 0 ? rows[0] : null;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error getting group info:', error);
      throw error;
    }
  }

  async updateGroupInfo(groupId, updates) {
    try {
      const connection = await db.getConnection();
      try {
        const fields = [];
        const values = [];
        
        if (updates.groupName) {
          fields.push('group_name = ?');
          values.push(updates.groupName);
        }
        
        if (updates.isActive !== undefined) {
          fields.push('is_active = ?');
          values.push(updates.isActive);
        }
        
        if (fields.length > 0) {
          values.push(groupId);
          await connection.execute(
            `UPDATE whatsapp_groups SET ${fields.join(', ')} WHERE group_id = ?`,
            values
          );
        }
        
        return { success: true };
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error updating group info:', error);
      throw error;
    }
  }

  isClientConnected() {
    return this.isConnected;
  }

  async disconnect() {
    if (this.client) {
      await this.client.destroy();
      this.isConnected = false;
    }
  }

  // Database-only methods (when WhatsApp is disabled)
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
