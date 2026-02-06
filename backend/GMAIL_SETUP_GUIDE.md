# Gmail App Password Setup Guide

## Step 1: Enable 2-Step Verification
1. Go to https://myaccount.google.com/
2. Click on "Security" in the left menu
3. Find "2-Step Verification" and click on it
4. If it's OFF, click "Turn on" and follow the setup process
5. You'll need to verify your phone number

## Step 2: Generate App Password
1. After 2-Step Verification is enabled, go back to Security page
2. Scroll down to "How you sign in to Google" section
3. Click on "App passwords" (you may need to sign in again)
4. Under "Select app", choose "Mail"
5. Under "Select device", choose "Windows Computer" (or "Other" if not listed)
6. Click "Generate"
7. Google will show you a 16-character password (like: xxxx xxxx xxxx xxxx)
8. **Copy this password immediately** - it won't be shown again

## Step 3: Update .env File
1. Open the .env file in your project
2. Replace this line:
   ```
   EMAIL_PASS=your-16-character-gmail-app-password
   ```
   With:
   ```
   EMAIL_PASS=xxxx-xxxx-xxxx-xxxx (use the actual 16-character password)
   ```
3. Save the file

## Step 4: Test Email Service
1. Open terminal in backend folder
2. Run: `node test-email-otp.js`
3. Check your email inbox for the test OTP

## Important Notes
- The app password is 16 characters (including spaces or dashes)
- Keep this password secure - it gives access to your Gmail account
- You can revoke app passwords anytime from Google Security settings
- Each app password is specific to the app and device you selected

## Troubleshooting
- If you get "Authentication failed", double-check the app password
- Make sure 2-Step Verification is enabled first
- Try generating a new app password if the first one doesn't work
