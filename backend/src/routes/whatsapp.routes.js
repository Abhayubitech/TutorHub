const express = require('express');
const router = express.Router();
const whatsappService = require('../services/whatsapp.service');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/payments/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Create WhatsApp group for a course
router.post('/groups', async (req, res) => {
  try {
    const groupData = req.body;
    const result = await whatsappService.createGroup(groupData);
    res.status(201).json({
      success: true,
      message: 'WhatsApp group created successfully',
      data: result
    });
  } catch (error) {
    console.error('Error creating WhatsApp group:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create WhatsApp group',
      error: error.message
    });
  }
});

// Get WhatsApp group by course and type
router.get('/groups/course/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { groupType = 'demo' } = req.query;
    const group = await whatsappService.getGroupByCourse(courseId, groupType);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'WhatsApp group not found'
      });
    }

    res.json({
      success: true,
      data: group
    });
  } catch (error) {
    console.error('Error fetching WhatsApp group:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch WhatsApp group',
      error: error.message
    });
  }
});

// Get all groups for a course
router.get('/groups/course/:courseId/all', async (req, res) => {
  try {
    const { courseId } = req.params;
    const groups = await whatsappService.getGroupsByCourse(courseId);
    res.json({
      success: true,
      data: groups
    });
  } catch (error) {
    console.error('Error fetching WhatsApp groups:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch WhatsApp groups',
      error: error.message
    });
  }
});

// Update WhatsApp group
router.put('/groups/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const updateData = req.body;
    const success = await whatsappService.updateGroup(groupId, updateData);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'WhatsApp group not found or no changes made'
      });
    }

    res.json({
      success: true,
      message: 'WhatsApp group updated successfully'
    });
  } catch (error) {
    console.error('Error updating WhatsApp group:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update WhatsApp group',
      error: error.message
    });
  }
});

// Delete WhatsApp group (soft delete)
router.delete('/groups/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const success = await whatsappService.deleteGroup(groupId);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'WhatsApp group not found'
      });
    }

    res.json({
      success: true,
      message: 'WhatsApp group deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting WhatsApp group:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete WhatsApp group',
      error: error.message
    });
  }
});

// Add member to WhatsApp group
router.post('/groups/:groupId/members', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId, phone, role = 'member' } = req.body;
    
    const result = await whatsappService.addMember(groupId, userId, phone, role);
    res.status(201).json({
      success: true,
      message: 'Member added to WhatsApp group successfully',
      data: result
    });
  } catch (error) {
    console.error('Error adding member to WhatsApp group:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add member to WhatsApp group',
      error: error.message
    });
  }
});

// Get members of a WhatsApp group
router.get('/groups/:groupId/members', async (req, res) => {
  try {
    const { groupId } = req.params;
    const members = await whatsappService.getGroupMembers(groupId);
    res.json({
      success: true,
      data: members
    });
  } catch (error) {
    console.error('Error fetching group members:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch group members',
      error: error.message
    });
  }
});

// Remove member from WhatsApp group
router.delete('/groups/:groupId/members/:userId', async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const success = await whatsappService.removeMember(groupId, userId);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Member not found in group'
      });
    }

    res.json({
      success: true,
      message: 'Member removed from WhatsApp group successfully'
    });
  } catch (error) {
    console.error('Error removing member from WhatsApp group:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove member from WhatsApp group',
      error: error.message
    });
  }
});

// Check if user is member of group
router.get('/groups/:groupId/members/:userId/check', async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const isMember = await whatsappService.isMemberOfGroup(groupId, userId);
    res.json({
      success: true,
      data: { isMember }
    });
  } catch (error) {
    console.error('Error checking group membership:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check group membership',
      error: error.message
    });
  }
});

module.exports = router;
