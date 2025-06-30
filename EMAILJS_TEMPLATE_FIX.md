# EmailJS Template Fix - Name Not Showing in Emails

## Problem
You're receiving emails but the name field is not showing up in the email content.

## Root Cause
The EmailJS template variables don't match the parameter names being sent from your contact form.

## Solution

### Step 1: Check Your EmailJS Template
1. Go to https://www.emailjs.com/
2. Login to your account
3. Go to **Email Templates**
4. Find your template: `template_gjtmaxv`
5. Click **Edit**

### Step 2: Update Template Variables
Your template should include these exact variable names:

```html
Subject: {{subject}}

From: {{from_name}} <{{from_email}}>
To: {{to_name}} <{{to_email}}>
Reply-To: {{reply_to}}

Message:
{{message}}

---
Contact Details:
Name: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}
Timestamp: {{timestamp}}
Contact Type: {{contact_type}}
```

### Step 3: Recommended Template Structure

**Subject Line:**
```
New Portfolio Contact: {{subject}}
```

**Email Body:**
```html
<h2>New Contact from Portfolio Website</h2>

<p><strong>From:</strong> {{from_name}} ({{from_email}})</p>
<p><strong>Subject:</strong> {{subject}}</p>
<p><strong>Received:</strong> {{timestamp}}</p>

<h3>Message:</h3>
<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
{{message}}
</div>

<hr>
<p><em>This message was sent from your portfolio contact form.</em></p>
<p><strong>Reply to:</strong> {{reply_to}}</p>
```

### Step 4: Variable Mapping
Your code sends these parameters:
- `from_name` → Sender's name
- `from_email` → Sender's email  
- `to_email` → Your email (akshayjuluri6704@gmail.com)
- `to_name` → Your name (Akshay Juluri)
- `subject` → Email subject
- `message` → Email message
- `reply_to` → Sender's email for replies
- `timestamp` → When message was sent
- `contact_type` → "Portfolio Website Contact"

### Step 5: Test Template
1. Save your updated template
2. Go to your portfolio website
3. Fill out the contact form with test data
4. Submit the form
5. Check your email (akshayjuluri6704@gmail.com)

### Step 6: Debug Information
Check browser console for these logs:
- "Form data being sent:" - Shows what user entered
- "Template parameters:" - Shows what's sent to EmailJS
- "EmailJS Response:" - Shows if email was sent successfully

### Common Issues & Fixes

**Issue 1: Variables show as {{from_name}} in email**
- Fix: Make sure template uses double curly braces: `{{from_name}}`
- Not single: `{from_name}` or triple: `{{{from_name}}}`

**Issue 2: Name field is empty**
- Fix: Check that template uses `{{from_name}}` not `{{name}}`
- The parameter is called `from_name`, not `name`

**Issue 3: Email not received at all**
- Check spam folder
- Verify email address: akshayjuluri6704@gmail.com
- Check EmailJS dashboard for send logs

**Issue 4: Template not updating**
- Clear browser cache
- Wait 5-10 minutes for EmailJS to update
- Try sending test email from EmailJS dashboard

### Verification Checklist
- [ ] Template uses `{{from_name}}` for sender name
- [ ] Template uses `{{from_email}}` for sender email
- [ ] Template uses `{{message}}` for message content
- [ ] Template uses `{{subject}}` for subject
- [ ] Template saved successfully in EmailJS dashboard
- [ ] Test email sent and received with all fields populated

### Example Working Template
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; }
        .header { background: #f0f0f0; padding: 20px; }
        .content { padding: 20px; }
        .footer { background: #f0f0f0; padding: 10px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>New Portfolio Contact</h2>
    </div>
    
    <div class="content">
        <p><strong>Name:</strong> {{from_name}}</p>
        <p><strong>Email:</strong> {{from_email}}</p>
        <p><strong>Subject:</strong> {{subject}}</p>
        <p><strong>Date:</strong> {{timestamp}}</p>
        
        <h3>Message:</h3>
        <p>{{message}}</p>
    </div>
    
    <div class="footer">
        <p>Sent from portfolio contact form</p>
        <p>Reply to: {{reply_to}}</p>
    </div>
</body>
</html>
```

This should fix the name not appearing in your emails!
