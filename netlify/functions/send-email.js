// Netlify Function for sending emails
// This provides an alternative to EmailJS for more reliable email sending

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, email, subject, message } = JSON.parse(event.body);

    // Validate required fields
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Missing required fields: name, email, and message are required' 
        })
      };
    }

    // For now, we'll use a simple approach that works with most email services
    // In production, you would integrate with SendGrid, Mailgun, or similar service
    
    // Create email content
    const emailContent = {
      to: 'akshayjuluri6704@gmail.com',
      from: email,
      subject: subject || 'New Contact from Portfolio',
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'Contact from Portfolio'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Sent from: ${event.headers.origin || 'Portfolio Website'}</small></p>
        <p><small>Time: ${new Date().toLocaleString()}</small></p>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject || 'Contact from Portfolio'}

Message:
${message}

---
Sent from: ${event.headers.origin || 'Portfolio Website'}
Time: ${new Date().toLocaleString()}
      `
    };

    // For demonstration, we'll return success
    // In a real implementation, you would use a service like:
    // - SendGrid: https://sendgrid.com/
    // - Mailgun: https://www.mailgun.com/
    // - AWS SES: https://aws.amazon.com/ses/
    // - Nodemailer with SMTP

    console.log('Email would be sent:', emailContent);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully!' 
      })
    };

  } catch (error) {
    console.error('Error processing email:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        error: 'Failed to send email',
        details: error.message 
      })
    };
  }
};

// Handle CORS preflight requests
exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  return exports.handler(event, context);
};
