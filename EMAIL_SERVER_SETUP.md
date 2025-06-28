# Email Server Setup for Portfolio Contact Form

## Current Status
The contact form currently uses the **mailto** approach as a fallback, which opens your email client. To enable **direct email sending**, follow the setup below.

## Option 1: Quick Setup (Recommended)

### Step 1: Set up Gmail App Password
1. Go to your Google Account settings
2. Enable 2-Factor Authentication if not already enabled
3. Go to Security → 2-Step Verification → App passwords
4. Generate an app password for "Mail"
5. Save this password securely

### Step 2: Install Server Dependencies
```bash
# In your project root directory
npm install express nodemailer cors dotenv nodemon
```

### Step 3: Create Environment File
1. Copy `.env.example` to `.env`
2. Update with your credentials:
```
EMAIL_USER=akshayjuluri6704@gmail.com
EMAIL_PASS=your-16-character-app-password
PORT=3001
```

### Step 4: Run the Email Server
```bash
# Start the email server
node server.js

# Or for development with auto-restart
npx nodemon server.js
```

### Step 5: Test the Contact Form
1. Make sure your portfolio is running (`npm run dev`)
2. Make sure the email server is running (`node server.js`)
3. Fill out the contact form and submit
4. You should receive emails directly to akshayjuluri6704@gmail.com

## Option 2: Deploy to Cloud (For Production)

### Deploy to Vercel/Netlify
1. Create a new repository for the server code
2. Deploy `server.js` to Vercel or Netlify Functions
3. Update the fetch URL in ContactSection.tsx to your deployed URL

### Deploy to Railway/Render
1. Push server code to GitHub
2. Connect to Railway or Render
3. Set environment variables in the platform
4. Update the fetch URL in ContactSection.tsx

## Current Behavior

**With Server Running:**
- ✅ Direct email sending to akshayjuluri6704@gmail.com
- ✅ No email client opening required
- ✅ Professional email notifications

**Without Server (Fallback):**
- 📧 Opens email client with pre-filled message
- 📋 Copies message to clipboard
- ⚠️ User needs to manually send the email

## Troubleshooting

### Server Not Starting
- Check if port 3001 is available
- Verify Gmail credentials in .env file
- Make sure 2FA and app password are set up correctly

### Emails Not Sending
- Check Gmail app password (not regular password)
- Verify email address is correct
- Check server console for error messages

### CORS Issues
- Make sure the server is running on localhost:3001
- Check that CORS is properly configured in server.js

## Security Notes
- Never commit the `.env` file to version control
- Use app passwords, not regular Gmail passwords
- Consider using environment variables in production
