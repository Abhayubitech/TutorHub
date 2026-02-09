USE tutorhub;

-- Add password reset fields to users table if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS reset_token_expiry DATETIME NULL;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_reset_token ON users(reset_token);
CREATE INDEX IF NOT EXISTS idx_reset_token_expiry ON users(reset_token_expiry);

-- Show the updated table structure
DESCRIBE users;
