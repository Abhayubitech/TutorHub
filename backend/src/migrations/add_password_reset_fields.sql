-- Add password reset fields to users table
ALTER TABLE users 
ADD COLUMN reset_token VARCHAR(255) NULL,
ADD COLUMN reset_token_expiry DATETIME NULL;

-- Create index for faster lookups
CREATE INDEX idx_reset_token ON users(reset_token);

-- Create index for expiry lookup
CREATE INDEX idx_reset_token_expiry ON users(reset_token_expiry);
