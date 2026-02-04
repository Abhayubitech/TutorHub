-- Add rejection_date column to course_requests table
-- This column is needed for the 11-day waiting period functionality

ALTER TABLE course_requests 
ADD COLUMN rejection_date TIMESTAMP NULL 
AFTER response_date;

-- Add index for better query performance
CREATE INDEX idx_course_requests_rejection_date ON course_requests(rejection_date);

-- Update any existing rejected requests to have a rejection_date
-- Set rejection_date to response_date for existing rejected requests
UPDATE course_requests 
SET rejection_date = response_date 
WHERE status = 'rejected' AND response_date IS NOT NULL;
