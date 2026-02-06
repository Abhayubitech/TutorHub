-- Sample data for testing WhatsApp groups and course enrollment

-- First, let's check if course 16 exists, if not, create sample courses
INSERT IGNORE INTO courses (id, teacher_id, subject, description, fee, mode, start_date, end_date) VALUES
(16, 1, 'Sanskrit', 'Learn Sanskrit from basics to advanced level', 110.00, 'hybrid', '2026-01-01', '2026-12-31'),
(15, 1, 'Mathematics', 'Comprehensive mathematics course', 150.00, 'online', '2026-01-01', '2026-12-31');

-- Create WhatsApp groups for course 16
INSERT IGNORE INTO whatsapp_groups (course_id, group_id, group_name, invite_link, teacher_phone, group_type, description) VALUES
(16, 'demo-group-16', 'Sanskrit Demo Group', 'https://chat.whatsapp.com/demo-sanskrit-16', '+1234567890', 'demo', 'Demo group for Sanskrit course'),
(16, 'approved-group-16', 'Sanskrit Approved Group', 'https://chat.whatsapp.com/approved-sanskrit-16', '+1234567890', 'approved', 'Approved group for paid students');

-- Create sample course schedules for course 16
INSERT IGNORE INTO course_schedules (course_id, day, start_time, end_time) VALUES
(16, 'Monday', '09:00:00', '10:00:00'),
(16, 'Wednesday', '09:00:00', '10:00:00'),
(16, 'Friday', '09:00:00', '10:00:00');

-- Create sample payment verification
INSERT IGNORE INTO payment_verifications (student_id, course_id, screenshot_path, payment_amount, payment_date, upi_transaction_id, status) VALUES
(2, 16, 'uploads/payments/payment-1778343685948-457684571.png', 110.00, '2026-01-01', 'UPI123456789', 'pending');
