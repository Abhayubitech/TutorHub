# WhatsApp Integration Setup Guide

## Overview
This guide explains how to set up and use the WhatsApp integration feature in TutorHub for automated group management and communication.

## Features Implemented
- ✅ Automatic WhatsApp group creation for each course
- ✅ Student invitation to WhatsApp groups upon course approval
- ✅ Zoom link sharing in WhatsApp groups
- ✅ Payment information broadcasting
- ✅ Group management and member tracking
- ✅ Teacher control over group settings

## Database Schema
New tables added:
- `whatsapp_groups` - Stores group information linked to courses
- `whatsapp_group_members` - Tracks group membership and roles

## API Endpoints

### WhatsApp Group Management
- `POST /api/courses/whatsapp-group` - Create WhatsApp group for a course
- `GET /api/courses/whatsapp-group/:courseId` - Get group information
- `POST /api/courses/whatsapp-group/add-student` - Add student to group
- `POST /api/courses/whatsapp-group/send-zoom` - Send Zoom link to group
- `POST /api/courses/whatsapp-group/send-payment` - Send payment info to group

### Enhanced Teacher Endpoints
- `PUT /api/teacher/enrollment-requests/:requestId` - Now includes automatic WhatsApp group invitation when approving students

## Setup Instructions

### 1. Database Migration
Run the updated database schema:
```sql
-- Your existing tables...
-- Add the new WhatsApp tables (already included in database.sql)
```

### 2. WhatsApp Client Setup
The WhatsApp service uses `whatsapp-web.js` and requires:
- Initial QR code scanning for authentication
- Stable internet connection
- WhatsApp Business account recommended

### 3. Environment Variables
Add to your `.env` file:
```env
# WhatsApp Configuration (optional)
WHATSAPP_ENABLED=true
WHATSAPP_HEADLESS=true
```

## Usage Workflow

### For Teachers:
1. **Create WhatsApp Group**: Use the API to create a group for your course
2. **Get Invite Link**: Share the invite link with students
3. **Approve Students**: When approving course requests, students are automatically added to the WhatsApp group
4. **Send Updates**: Use the API to send Zoom links and payment information

### For Students:
1. **Request Course**: Apply for course enrollment as usual
2. **Receive Approval**: Get approved by teacher
3. **Join WhatsApp Group**: Automatically added to course WhatsApp group
4. **Receive Updates**: Get Zoom links, payment info, and announcements in the group

## API Usage Examples

### Create WhatsApp Group
```javascript
POST /api/courses/whatsapp-group
{
  "courseId": 1,
  "courseName": "Mathematics 101",
  "teacherPhone": "+1234567890"
}
```

### Send Zoom Link
```javascript
POST /api/courses/whatsapp-group/send-zoom
{
  "courseId": 1,
  "zoomLink": "https://zoom.us/j/123456789"
}
```

### Send Payment Information
```javascript
POST /api/courses/whatsapp-group/send-payment
{
  "courseId": 1,
  "paymentDetails": {
    "fee": 5000,
    "method": "Bank Transfer",
    "dueDate": "2024-02-15"
  }
}
```

## Error Handling
- WhatsApp service unavailable: Graceful fallback without breaking core functionality
- Group creation failures: Logged but don't prevent course operations
- Student addition failures: Logged but approval still succeeds

## Security Considerations
- All WhatsApp endpoints require authentication
- Phone numbers are validated before use
- Group membership is tracked in the database
- Teacher permissions enforced for group management

## Troubleshooting

### WhatsApp Client Not Connected
- Check server logs for QR code
- Ensure stable internet connection
- Verify WhatsApp account status

### Group Creation Fails
- Verify teacher phone number format
- Check WhatsApp Business API limits
- Ensure sufficient storage for session files

### Student Not Added to Group
- Verify student phone number in database
- Check if student's WhatsApp is active
- Review group member limits

## Future Enhancements
- Message templates for different types of announcements
- Scheduled message sending
- Group analytics and engagement tracking
- Multi-language support
- WhatsApp Business API integration for higher volume
