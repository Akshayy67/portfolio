# EmailJS Setup Guide

This guide will help you set up EmailJS for direct email sending from your contact form.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create Email Service

1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down your **Service ID**

## Step 3: Create Email Template

1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. **IMPORTANT**: Use this EXACT template structure for proper formatting:

### Email Template Configuration:

**To Email:** `{{to_email}}`
**From Name:** `Portfolio Contact Form`
**Reply To:** `{{reply_to}}`
**Subject:** `{{subject}}`

**Email Body (HTML):**

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      .header {
        background: #f4f4f4;
        padding: 20px;
        border-radius: 5px;
        margin-bottom: 20px;
      }
      .content {
        padding: 20px;
      }
      .sender-info {
        background: #e8f4fd;
        padding: 15px;
        border-radius: 5px;
        margin: 15px 0;
      }
      .message-box {
        background: #f9f9f9;
        padding: 15px;
        border-left: 4px solid #007cba;
        margin: 15px 0;
      }
      .footer {
        font-size: 12px;
        color: #666;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #eee;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h2>🚀 New Contact from Portfolio Website</h2>
      <p><strong>Contact Type:</strong> {{contact_type}}</p>
      <p><strong>Received:</strong> {{timestamp}}</p>
    </div>

    <div class="content">
      <div class="sender-info">
        <h3>👤 Contact Information</h3>
        <p><strong>Name:</strong> {{from_name}}</p>
        <p><strong>Email:</strong> {{from_email}}</p>
        <p><strong>Subject:</strong> {{subject}}</p>
      </div>

      <div class="message-box">
        <h3>💬 Message</h3>
        <p>{{message}}</p>
      </div>
    </div>

    <div class="footer">
      <p>This message was sent from your portfolio website contact form.</p>
      <p>You can reply directly to this email to respond to {{from_name}}.</p>
    </div>
  </body>
</html>
```

**Email Body (Plain Text Fallback):**

```
{{formatted_message}}
```

4. **Variable Names Used:**

   - `{{to_name}}` - Your name (Akshay Juluri)
   - `{{to_email}}` - Your email
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{reply_to}}` - Reply-to address (sender's email)
   - `{{subject}}` - Email subject with "Portfolio Contact:" prefix
   - `{{message}}` - Original message content
   - `{{contact_type}}` - Type of contact (Portfolio Website Contact)
   - `{{timestamp}}` - When the message was sent
   - `{{formatted_message}}` - Pre-formatted message for plain text

5. Note down your **Template ID**

## Step 4: Get Public Key

1. Go to "Integration" in your dashboard
2. Find your **Public Key** (also called User ID)

## Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Replace the placeholder values:

```env
VITE_EMAILJS_SERVICE_ID=your_actual_service_id
VITE_EMAILJS_TEMPLATE_ID=your_actual_template_id
VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key
```

## Step 6: Test the Contact Form

1. Restart your development server: `npm run dev`
2. Fill out the contact form on your website
3. Click "Send Message"
4. Check your email to confirm the message was received

## Troubleshooting

- **EmailJS not configured error**: Make sure all environment variables are set correctly
- **Template not found**: Verify your template ID is correct
- **Service not found**: Verify your service ID is correct
- **Unauthorized**: Check your public key is correct

## Free Tier Limits

EmailJS free tier includes:

- 200 emails per month
- 2 email services
- 1 email template

For higher usage, consider upgrading to a paid plan.
