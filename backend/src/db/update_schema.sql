ALTER TABLE teacher_profiles ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending';
