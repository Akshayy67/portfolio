// EmailJS Configuration
// This file handles EmailJS configuration for both development and production
import emailjs from "@emailjs/browser";

export interface EmailJSConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

// Get EmailJS configuration with fallbacks for production deployment
export const getEmailJSConfig = (): EmailJSConfig => {
  // Try to get from environment variables first (works in development)
  const envServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const envTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const envPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // Production fallback values (your actual EmailJS credentials)
  const config: EmailJSConfig = {
    serviceId: envServiceId || "service_mshm1ku",
    templateId: envTemplateId || "template_gjtmaxv",
    publicKey: envPublicKey || "e8z9fkbuNRmd04-70",
  };

  // Log configuration status (without exposing sensitive data in production)
  const isDev = import.meta.env.MODE === "development";
  console.log("EmailJS Configuration:", {
    environment: import.meta.env.MODE,
    serviceId: config.serviceId ? "✓ Available" : "✗ Missing",
    templateId: config.templateId ? "✓ Available" : "✗ Missing",
    publicKey: config.publicKey ? "✓ Available" : "✗ Missing",
    ...(isDev && {
      actualValues: config, // Only show actual values in development
    }),
  });

  return config;
};

// Validate EmailJS configuration
export const validateEmailJSConfig = (config: EmailJSConfig): boolean => {
  return !!(config.serviceId && config.templateId && config.publicKey);
};

// EmailJS template parameters interface
export interface EmailTemplateParams {
  from_name: string;
  from_email: string;
  to_email: string;
  to_name: string;
  subject: string;
  message: string;
  reply_to: string;
  timestamp: string;
  contact_type?: string;
  // Additional parameter variations for compatibility
  name?: string; // Alternative name parameter
  email?: string; // Alternative email parameter
  user_name?: string; // Another common variation
  sender_name?: string; // Another variation
}

// Create template parameters for EmailJS
export const createTemplateParams = (formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): EmailTemplateParams => {
  // Enhanced message with ALL details included as fallback
  const enhancedMessage = `📧 NEW PORTFOLIO CONTACT 📧

👤 NAME: ${formData.name}
📧 EMAIL: ${formData.email}
📝 SUBJECT: ${formData.subject || "New Portfolio Contact"}
🕒 TIME: ${new Date().toLocaleString()}

💬 MESSAGE:
${formData.message}

---
✅ This message was sent from your portfolio contact form
🔄 Reply directly to: ${formData.email}
📱 Contact Type: Portfolio Website Contact`;

  return {
    from_name: formData.name,
    from_email: formData.email,
    to_email: "akshayjuluri6704@gmail.com",
    to_name: "Akshay Juluri",
    subject: formData.subject || "New Portfolio Contact",
    message: enhancedMessage, // Include all details in message as fallback
    reply_to: formData.email,
    timestamp: new Date().toLocaleString(),
    contact_type: "Portfolio Website Contact",
    // Additional parameter variations for maximum compatibility
    name: formData.name, // Alternative name parameter
    email: formData.email, // Alternative email parameter
    user_name: formData.name, // Another common variation
    sender_name: formData.name, // Another variation
  };
};

// Send email with retry logic
export const sendEmailWithRetry = async (
  serviceId: string,
  templateId: string,
  templateParams: EmailTemplateParams,
  maxRetries: number = 3
): Promise<any> => {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`EmailJS attempt ${attempt}/${maxRetries}`);

      // Add a small delay between retries
      if (attempt > 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }

      const result = await emailjs.send(serviceId, templateId, templateParams);
      console.log(`EmailJS success on attempt ${attempt}:`, result);
      return result;
    } catch (error) {
      console.warn(`EmailJS attempt ${attempt} failed:`, error);
      lastError = error;

      // Don't retry on certain errors
      if (error && typeof error === "object" && "status" in error) {
        const status = (error as any).status;
        if (status === 400 || status === 401 || status === 403) {
          console.error("EmailJS configuration error, not retrying:", error);
          throw error;
        }
      }
    }
  }

  throw lastError;
};
