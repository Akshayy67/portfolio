import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import emailjs from "@emailjs/browser";
import {
  Send,
  MapPin,
  Mail,
  MessageSquare,
  User,
  FileText,
  Phone,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  getEmailJSConfig,
  validateEmailJSConfig,
  createTemplateParams,
  sendEmailWithRetry,
} from "../config/emailjs";
import EnhancedParallax from "./EnhancedParallax";
import { ContactBackground } from "./SectionBackgrounds";
import { useTheme } from "../contexts/ThemeContext";
import { trackSectionView } from "../services/analytics";

const ContactSection: React.FC = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const { isDarkMode } = useTheme();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Enhanced validation states
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [fieldTouched, setFieldTouched] = useState({
    name: false,
    email: false,
    subject: false,
    message: false,
  });

  const [isFormValid, setIsFormValid] = useState(false);

  // Autocomplete suggestions state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [useAI, setUseAI] = useState(true); // Enable AI by default
  const [aiStatus, setAiStatus] = useState<
    "idle" | "loading" | "success" | "fallback" | "error"
  >("idle");
  const [aiError, setAiError] = useState<string | null>(null);

  // Character limits
  const charLimits = {
    name: 50,
    subject: 100,
    message: 1000,
  };

  // Message suggestions with categories
  const messageSuggestions = [
    "I love your work!",
    "How can I collaborate with you?",
    "Let's connect!",
    "I have a project idea for you.",
    "I'd like to discuss a potential opportunity.",
    "Your portfolio is impressive! Can we chat?",
    "I'm interested in hiring you for a project.",
    "Would you be available for freelance work?",
    "I'd love to learn more about your experience.",
    "Can you help me with my project?",
    "I need help with web development.",
    "Looking for a React developer.",
    "Interested in full-stack development.",
    "Want to discuss mobile app development.",
    "Need assistance with UI/UX design.",
    "Looking for machine learning expertise.",
    "Interested in your Python skills.",
    "Can we schedule a call?",
    "What's your availability?",
    "Let's discuss rates and timeline.",
  ];

  // Enhanced AI-powered suggestion generation with better error handling
  const generateAISuggestions = async (currentMessage: string) => {
    if (!currentMessage.trim() || currentMessage.length < 10) {
      return []; // Don't generate AI suggestions for very short messages
    }

    setIsLoadingAI(true);
    setAiStatus("loading");
    setAiError(null);

    try {
      const aiSuggestions = await generateSmartSuggestions(currentMessage);

      if (aiSuggestions.length > 0) {
        setAiSuggestions(aiSuggestions);
        setAiStatus("success");
        return aiSuggestions;
      } else {
        setAiStatus("fallback");
        return [];
      }
    } catch (error) {
      console.error("❌ AI suggestions failed:", error);
      setAiError(
        error instanceof Error ? error.message : "AI service unavailable"
      );
      setAiStatus("error");
      return [];
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Working AI suggestion generator using FREE APIs
  const generateSmartSuggestions = async (
    message: string
  ): Promise<string[]> => {
    console.log("🤖 Generating AI suggestions for:", message);

    try {
      // Try the free AI API first
      const aiSuggestions = await tryFreeAI(message);
      if (aiSuggestions.length > 0) {
        console.log("✅ AI suggestions generated:", aiSuggestions);
        return aiSuggestions;
      }
    } catch (error) {
      console.warn("Free AI failed:", error);
    }

    // Fallback to smart contextual suggestions
    console.log("Using smart contextual fallback");
    return await generateContextualFallback(message);
  };

  // Try free AI services with better models and error handling
  const tryFreeAI = async (
    message: string,
    retryCount = 0
  ): Promise<string[]> => {
    const maxRetries = 2;

    // Option 1: Try Hugging Face with a better text completion model
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/gpt2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: message,
            parameters: {
              max_new_tokens: 30,
              num_return_sequences: 4,
              temperature: 0.7,
              do_sample: true,
              return_full_text: false,
              repetition_penalty: 1.1,
              top_p: 0.9,
            },
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("🤖 Hugging Face GPT-2 response:", result);

        if (Array.isArray(result) && result.length > 0) {
          const suggestions = result
            .map((item: any) => {
              if (item.generated_text) {
                // Clean up the generated text
                let text = item.generated_text.trim();

                // Remove the original message if it's included
                if (text.startsWith(message)) {
                  text = text.substring(message.length).trim();
                }

                // Clean up and format
                text = text
                  .replace(/^\W+/, "") // Remove leading non-word characters
                  .replace(/\s+/g, " ") // Normalize whitespace
                  .trim();

                // Ensure it starts with a space for proper concatenation
                if (text && !text.startsWith(" ")) {
                  text = " " + text;
                }

                return text;
              }
              return "";
            })
            .filter((text: string) => text.length > 3 && text.length < 80)
            .slice(0, 3);

          if (suggestions.length > 0) {
            console.log("✅ Generated AI suggestions:", suggestions);
            return suggestions;
          }
        }
      } else {
        console.warn("Hugging Face API response not OK:", response.status);
        // If it's a 503 (service unavailable) and we haven't retried much, try again
        if (response.status === 503 && retryCount < maxRetries) {
          console.log(
            `🔄 Retrying AI request (attempt ${retryCount + 1}/${maxRetries})`
          );
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * (retryCount + 1))
          ); // Exponential backoff
          return tryFreeAI(message, retryCount + 1);
        }
      }
    } catch (error) {
      console.warn("Hugging Face API error:", error);
      // Retry on network errors
      if (retryCount < maxRetries) {
        console.log(
          `🔄 Retrying AI request after error (attempt ${
            retryCount + 1
          }/${maxRetries})`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (retryCount + 1))
        );
        return tryFreeAI(message, retryCount + 1);
      }
    }

    // Option 2: Try a simpler text completion approach
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/gpt2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: message + " ",
            parameters: {
              max_new_tokens: 30,
              temperature: 0.8,
              return_full_text: false,
            },
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("GPT-2 response:", result);

        if (result && result[0] && result[0].generated_text) {
          const completion = result[0].generated_text.trim();
          if (completion.length > 5) {
            // Split into sentences and clean up
            const sentences = completion
              .split(/[.!?]+/)
              .map((s: string) => s.trim())
              .filter((s: string) => s.length > 5 && s.length < 80)
              .slice(0, 2);

            if (sentences.length > 0) {
              return sentences;
            }
          }
        }
      }
    } catch (error) {
      console.warn("GPT-2 API error:", error);
    }

    return [];
  };

  // Improved contextual fallback (much better than before)
  const generateContextualFallback = async (
    message: string
  ): Promise<string[]> => {
    const messageLower = message.toLowerCase();

    // Analyze the message for intent and context
    const intents = {
      needsHelp: /need help|assistance|support|guidance/.test(messageLower),
      hasProject: /project|build|create|develop|make/.test(messageLower),
      wantsToHire: /hire|employ|work with|looking for/.test(messageLower),
      askingAbout: /about|regarding|concerning|question/.test(messageLower),
      interested: /interested|curious|want to know/.test(messageLower),
      technical: /web|app|mobile|react|javascript|python|database/.test(
        messageLower
      ),
      business: /business|company|startup|enterprise/.test(messageLower),
      timeline: /when|timeline|deadline|urgent|asap/.test(messageLower),
      budget: /cost|price|budget|rate|fee/.test(messageLower),
    };

    let suggestions: string[] = [];

    // Generate contextual suggestions based on detected intents
    if (intents.hasProject && intents.technical) {
      suggestions.push(
        "I'd love to discuss the technical requirements and architecture.",
        "What technologies are you considering for this project?",
        "I can provide a detailed project timeline and cost estimate."
      );
    } else if (intents.wantsToHire) {
      suggestions.push(
        "I'm available for new projects and would love to learn more.",
        "Let's schedule a call to discuss your requirements.",
        "I can share my portfolio and recent work examples."
      );
    } else if (intents.needsHelp && intents.technical) {
      suggestions.push(
        "I specialize in full-stack development and can definitely help.",
        "What specific challenges are you facing with your project?",
        "I have experience solving similar technical problems."
      );
    } else if (intents.timeline || intents.budget) {
      suggestions.push(
        "I offer flexible pricing options for different project sizes.",
        "My typical turnaround time depends on project complexity.",
        "Let's discuss your timeline and budget requirements."
      );
    } else if (intents.business) {
      suggestions.push(
        "I work with businesses of all sizes, from startups to enterprises.",
        "I can help scale your technical infrastructure as you grow.",
        "Let's explore how technology can drive your business goals."
      );
    } else {
      // General professional suggestions
      suggestions.push(
        "I'd be happy to discuss how I can help with your project.",
        "Feel free to share more details about what you're looking for.",
        "Let's connect and explore potential collaboration opportunities."
      );
    }

    return suggestions.slice(0, 4);
  };

  // YouTube-style suggestion system
  const getYouTubeLikeSuggestions = () => {
    const currentMessage = formData.message.trim();

    // If message is empty, show popular starting phrases
    if (!currentMessage) {
      return [
        "Let's meet for a coffee and discuss!",
        "I need help with",
        "I'm looking for",
        "Can you help me",
        "I want to hire",
        "I have a project",
        "I'm interested in",
        "Looking for a developer",
        "Need assistance with",
      ];
    }

    // Get all possible completions (AI + static)
    let allSuggestions: string[] = [];

    // Add AI suggestions if available (show as-is, not prepended)
    if (useAI && aiSuggestions.length > 0) {
      allSuggestions.push(...aiSuggestions);
    }

    // Add contextual completions based on what they're typing
    const completions = getContextualCompletions(currentMessage);
    allSuggestions.push(...completions);

    // Filter and sort by relevance (like YouTube)
    return allSuggestions
      .filter(
        (suggestion) =>
          suggestion.toLowerCase().startsWith(currentMessage.toLowerCase()) ||
          suggestion.toLowerCase().includes(currentMessage.toLowerCase())
      )
      .slice(0, 8) // Show max 8 suggestions like YouTube
      .sort((a, b) => {
        // Prioritize suggestions that start with the current text
        const aStarts = a
          .toLowerCase()
          .startsWith(currentMessage.toLowerCase());
        const bStarts = b
          .toLowerCase()
          .startsWith(currentMessage.toLowerCase());
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.length - b.length; // Shorter suggestions first
      });
  };

  // Generate contextual completions like YouTube search suggestions
  const getContextualCompletions = (currentText: string): string[] => {
    const text = currentText.toLowerCase();
    const completions: string[] = [];

    // Common starting phrases and their completions
    if (text.startsWith("i need")) {
      completions.push(
        "I need help with my website",
        "I need a developer for my project",
        "I need someone to build an app",
        "I need assistance with React development",
        "I need a full-stack developer"
      );
    } else if (text.startsWith("i'm looking")) {
      completions.push(
        "I'm looking for a web developer",
        "I'm looking for someone to help with my project",
        "I'm looking for a React specialist",
        "I'm looking for a freelance developer",
        "I'm looking for long-term collaboration"
      );
    } else if (text.startsWith("can you")) {
      completions.push(
        "Can you help me build a website",
        "Can you develop a mobile app",
        "Can you create an e-commerce site",
        "Can you work on a React project",
        "Can you help with full-stack development"
      );
    } else if (text.startsWith("i want")) {
      completions.push(
        "I want to hire a developer",
        "I want to build a website",
        "I want to create a mobile app",
        "I want to discuss a project",
        "I want to collaborate on something"
      );
    } else if (text.startsWith("i have")) {
      completions.push(
        "I have a project that needs development",
        "I have an idea for a web application",
        "I have a startup that needs technical help",
        "I have a website that needs improvement",
        "I have a mobile app concept"
      );
    } else {
      // Partial word matching for any position
      if (text.includes("web")) {
        completions.push(
          currentText + " development project",
          currentText + " application for my business",
          currentText + " platform with modern features"
        );
      }
      if (text.includes("app")) {
        completions.push(
          currentText + " for iOS and Android",
          currentText + " with great user experience",
          currentText + " that integrates with my website"
        );
      }
      if (text.includes("project")) {
        completions.push(
          currentText + " that requires React expertise",
          currentText + " with tight deadline",
          currentText + " for my startup"
        );
      }
    }

    return completions;
  };

  // Validation functions
  const validateEmail = (email: string): string => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.length > charLimits.name)
          return `Name must be less than ${charLimits.name} characters`;
        return "";
      case "email":
        return validateEmail(value);
      case "subject":
        if (value.length > charLimits.subject)
          return `Subject must be less than ${charLimits.subject} characters`;
        return "";
      case "message":
        if (!value.trim()) return "Message is required";
        if (value.length > charLimits.message)
          return `Message must be less than ${charLimits.message} characters`;
        return "";
      default:
        return "";
    }
  };

  // Auto-save to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("portfolio-contact-form");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (error) {
        console.log("Error loading saved form data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (
      formData.name ||
      formData.email ||
      formData.subject ||
      formData.message
    ) {
      localStorage.setItem("portfolio-contact-form", JSON.stringify(formData));
    }
  }, [formData]);

  // Validate form on changes
  useEffect(() => {
    const errors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      subject: validateField("subject", formData.subject),
      message: validateField("message", formData.message),
    };
    setFieldErrors(errors);

    const isValid = Boolean(
      !errors.name &&
        !errors.email &&
        !errors.message &&
        formData.name.trim() &&
        formData.email.trim() &&
        formData.message.trim()
    );
    setIsFormValid(isValid);
  }, [formData]);

  const showToastMessage = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    // Longer display time for success messages since they're more prominent now
    setTimeout(() => setShowToast(false), type === "success" ? 8000 : 6000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched for validation display
    setFieldTouched({
      name: true,
      email: true,
      subject: true,
      message: true,
    });

    // Validate form
    if (!isFormValid) {
      showToastMessage(
        "Please fix the errors in the form before submitting.",
        "error"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Get EmailJS configuration with production fallbacks
      const config = getEmailJSConfig();

      // Validate configuration
      if (!validateEmailJSConfig(config)) {
        console.warn("EmailJS not fully configured, using fallback method");
        throw new Error("EmailJS service not available");
      }

      // Initialize EmailJS with public key
      emailjs.init(config.publicKey);

      // Prepare template parameters
      const templateParams = createTemplateParams(formData);

      console.log("Attempting to send email via EmailJS...", {
        serviceId: config.serviceId,
        templateId: config.templateId,
        environment: import.meta.env.MODE,
        timestamp: templateParams.timestamp,
      });

      console.log("🔍 DEBUG: Form data being sent:", formData);
      console.log("🔍 DEBUG: Template parameters:", templateParams);
      console.log("🔍 DEBUG: Parameter check:", {
        "from_name exists": !!templateParams.from_name,
        "from_name value": templateParams.from_name,
        "from_email exists": !!templateParams.from_email,
        "from_email value": templateParams.from_email,
        "message length": templateParams.message.length,
        "all parameters": Object.keys(templateParams),
      });

      // Send email using EmailJS with retry logic
      const result = await sendEmailWithRetry(
        config.serviceId,
        config.templateId,
        templateParams
      );

      console.log("EmailJS Response:", result);

      if (result.status === 200) {
        // Success - email sent directly
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        // Clear auto-saved data
        localStorage.removeItem("portfolio-contact-form");
        // Reset touched fields
        setFieldTouched({
          name: false,
          email: false,
          subject: false,
          message: false,
        });
        showToastMessage(
          "Thank you for reaching out! Your message has been delivered successfully. I'll review it and get back to you within 24 hours. 🚀"
        );
      } else {
        throw new Error(`EmailJS failed with status: ${result.status}`);
      }
    } catch (error) {
      console.error("EmailJS failed:", error);
      console.log("Trying alternative email methods...");

      // Try backend email service as first fallback
      try {
        const backendResponse = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: formData.subject || "Contact from Portfolio",
            message: formData.message,
          }),
        });

        if (backendResponse.ok) {
          const result = await backendResponse.json();
          console.log("Backend email sent successfully:", result);

          // Reset form
          setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
          });
          localStorage.removeItem("portfolio-contact-form");
          setFieldTouched({
            name: false,
            email: false,
            subject: false,
            message: false,
          });

          showToastMessage(
            "Perfect! Your message has been sent successfully. I'll review it and respond within 24 hours. Thanks for connecting! 🎉"
          );
          return; // Exit early on success
        } else {
          console.warn(
            "Backend email service failed:",
            await backendResponse.text()
          );
        }
      } catch (backendError) {
        console.warn("Backend email service unavailable:", backendError);
      }

      console.log("Using enhanced fallback options");

      // Enhanced fallback with better user experience
      const messageText = `Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject || "Contact from Portfolio"}

Message:
${formData.message}

---
Sent from: ${window.location.origin}
Time: ${new Date().toLocaleString()}`;

      try {
        // Try multiple fallback methods
        let fallbackSuccess = false;

        // Method 1: Try to copy to clipboard first
        try {
          await navigator.clipboard.writeText(messageText);
          fallbackSuccess = true;
          console.log("✅ Message copied to clipboard");
        } catch (clipboardError) {
          console.warn("Clipboard not available:", clipboardError);
        }

        // Method 2: Create a downloadable text file as backup
        const blob = new Blob([messageText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = `contact-message-${Date.now()}.txt`;

        // Check if user is on mobile or desktop for better UX
        const isMobile =
          /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          );

        // Method 3: Always try mailto as primary fallback
        const subject = encodeURIComponent(
          formData.subject || "Contact from Portfolio"
        );
        const body = encodeURIComponent(messageText);
        const mailtoLink = `mailto:akshayjuluri6704@gmail.com?subject=${subject}&body=${body}`;

        if (isMobile) {
          // On mobile, email apps work better
          try {
            const emailWindow = window.open(mailtoLink, "_blank");
            if (!emailWindow) {
              window.location.href = mailtoLink;
            }
            showToastMessage(
              fallbackSuccess
                ? "📱 Email app opened! Message also copied to clipboard as backup."
                : "📱 Email app opened with your message!"
            );
          } catch (emailError) {
            console.error("Email app failed:", emailError);
            // Trigger download as last resort
            downloadLink.click();
            showToastMessage(
              "📄 Message downloaded as text file. Please email it to akshayjuluri6704@gmail.com"
            );
          }
        } else {
          // On desktop, give users multiple options
          if (fallbackSuccess) {
            showToastMessage(
              "📋 Message copied to clipboard! Opening email options...",
              "success"
            );

            // Show user-friendly options
            setTimeout(() => {
              const userChoice = confirm(
                "Your message has been copied to clipboard!\n\n" +
                  "Choose your preferred method:\n" +
                  "• Click 'OK' to open your default email app\n" +
                  "• Click 'Cancel' to paste the message in Gmail/Outlook manually\n\n" +
                  "Email: akshayjuluri6704@gmail.com"
              );

              if (userChoice) {
                try {
                  window.open(mailtoLink, "_blank") ||
                    (window.location.href = mailtoLink);
                } catch (emailError) {
                  console.error("Email client failed:", emailError);
                  downloadLink.click();
                  showToastMessage(
                    "📄 Email client unavailable. Message downloaded as backup."
                  );
                }
              } else {
                showToastMessage(
                  "📋 Message is in your clipboard. Paste it in your email app!"
                );
              }
            }, 1500);
          } else {
            // Clipboard failed, try email client directly
            try {
              window.open(mailtoLink, "_blank") ||
                (window.location.href = mailtoLink);
              showToastMessage("📧 Email client opened with your message!");
            } catch (emailError) {
              console.error("Email client failed:", emailError);
              downloadLink.click();
              showToastMessage(
                "📄 Message downloaded as text file. Please email it to akshayjuluri6704@gmail.com",
                "error"
              );
            }
          }
        }

        // Clean up the blob URL
        setTimeout(() => URL.revokeObjectURL(url), 1000);

        // Reset form on any successful fallback
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        localStorage.removeItem("portfolio-contact-form");
        setFieldTouched({
          name: false,
          email: false,
          subject: false,
          message: false,
        });
      } catch (fallbackError) {
        console.error("All fallback methods failed:", fallbackError);

        // Last resort: show contact information
        showToastMessage(
          "⚠️ Please contact me directly at akshayjuluri6704@gmail.com or via LinkedIn. Your message: " +
            formData.message.substring(0, 50) +
            "...",
          "error"
        );

        // Log the full message for user to copy manually
        console.log("=== CONTACT MESSAGE (copy manually) ===");
        console.log(messageText);
        console.log("=== END MESSAGE ===");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadResume = () => {
    const link = document.createElement("a");
    link.href = "/AkshayResume.pdf";
    link.download = "AkshayResume.pdf";
    link.click();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Character limit enforcement
    const limits = charLimits as Record<string, number>;
    if (limits[name] && value.length > limits[name]) {
      return; // Don't update if exceeding limit
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    // Handle suggestions for message field
    if (name === "message") {
      // YouTube behavior: Show suggestions as you type
      setShowSuggestions(true);
      setSelectedSuggestionIndex(-1);

      // Trigger AI suggestions if enabled and message is long enough
      if (useAI && value.length > 10) {
        // Trigger AI after every keystroke
        generateAISuggestions(value);
      }
    }

    // Auto-save to localStorage
    const updatedData = { ...formData, [name]: value };
    localStorage.setItem("portfolio-contact-form", JSON.stringify(updatedData));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setFieldTouched({
      ...fieldTouched,
      [name]: true,
    });

    // YouTube behavior: Hide suggestions when focus is lost
    if (name === "message") {
      // Short delay to allow for suggestion clicks
      setTimeout(() => {
        // Only hide if not clicking on a suggestion button
        const activeElement = document.activeElement;
        const isClickingOnSuggestion = activeElement?.closest(
          "[data-suggestion-button]"
        );
        if (!isClickingOnSuggestion) {
          setShowSuggestions(false);
        }
      }, 150);
    }
  };

  const handleMessageFocus = () => {
    // YouTube behavior: Always show suggestions when focused
    setShowSuggestions(true);
    setSelectedSuggestionIndex(-1);
  };

  const handleSuggestionClick = (suggestion: string) => {
    console.log("YouTube-style suggestion clicked:", suggestion);

    // YouTube behavior: Replace the entire message with the suggestion
    const newMessage = suggestion;

    setFormData({
      ...formData,
      message: newMessage,
    });

    // Hide suggestions after selection (like YouTube)
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);

    // Focus back on the textarea after selection
    setTimeout(() => {
      const textarea = document.querySelector(
        'textarea[name="message"]'
      ) as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        // Move cursor to end of text
        textarea.setSelectionRange(newMessage.length, newMessage.length);
      }
    }, 10);

    // Auto-save the updated message
    const updatedData = { ...formData, message: newMessage };
    localStorage.setItem("portfolio-contact-form", JSON.stringify(updatedData));
  };

  const handleMessageKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (!showSuggestions) return;

    const filteredSuggestions = getYouTubeLikeSuggestions();

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case "Enter":
        if (
          selectedSuggestionIndex >= 0 &&
          filteredSuggestions[selectedSuggestionIndex]
        ) {
          e.preventDefault();
          handleSuggestionClick(filteredSuggestions[selectedSuggestionIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email Communication",
      value: "akshayjuluri6704@gmail.com",
      description: "Primary channel for professional inquiries",
    },
    {
      icon: Phone,
      label: "Phone Contact",
      value: "7382005522",
      description: "Direct line for urgent communications",
    },
    {
      icon: MapPin,
      label: "Current Location",
      value: "Hyderabad",
      description: "Available for remote and on-site opportunities",
    },
  ];

  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackSectionView("Contact");
        }
      },
      { threshold: 0.5 }
    );
    if (contactRef.current) observer.observe(contactRef.current);
    return () => {
      if (contactRef.current) observer.unobserve(contactRef.current);
    };
  }, []);

  return (
    <EnhancedParallax
      className={`min-h-screen py-20 relative overflow-hidden ${
        isDarkMode ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
      intensity="medium"
      backgroundLayers={[
        {
          children: <ContactBackground />,
          speed: 0.4,
          direction: "up",
          className: "z-0",
        },
        {
          children: (
            <div className="absolute inset-0">
              {/* Enhanced communication signals for mobile */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 border-2 border-orange-400/30 rounded-full"
                  style={{
                    left: `${25 + i * 12}%`,
                    top: `${35 + Math.sin(i) * 15}%`,
                  }}
                  animate={{
                    scale: [1, 2.5, 1],
                    opacity: [0.3, 0.8, 0.3],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 5 + i,
                    repeat: Infinity,
                    delay: i * 0.8,
                  }}
                />
              ))}
            </div>
          ),
          speed: 0.6,
          direction: "down",
          className: "z-1",
        },
      ]}
    >
      <section id="contact" data-section="contact" className="relative z-10">
        {/* Signal Lines */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-24 bg-gradient-to-t from-orange-400/20 to-transparent"
            style={{
              left: `${10 + i * 10}%`,
              top: "20%",
              transformOrigin: "bottom",
            }}
            animate={{
              scaleY: [0.5, 1.5, 0.5],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}

        <div
          ref={contactRef}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className={`text-4xl md:text-6xl font-display font-bold mb-4 text-shadow-soft ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Contact <span className="interstellar-text">Me</span>
            </h2>
            <p
              className={`text-xl max-w-3xl mx-auto ${
                isDarkMode ? "text-white/70" : "text-gray-600"
              }`}
            >
              Let's connect! Whether you have a question, want to collaborate,
              or just want to say hi, my inbox is always open.
            </p>
            <div className="mt-4 p-3 bg-orange-400/10 border border-orange-400/20 rounded-lg max-w-2xl mx-auto">
              <p className="text-sm text-orange-400/90 text-center">
                💡 <strong>Multiple ways to reach me:</strong> Form submission,
                direct email, or LinkedIn - choose what works best for you!
              </p>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Contact Information */}
            <motion.div
              className="space-y-6 sm:space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div
                className={`glass-morphism-dark noise-texture rounded-xl p-4 sm:p-6 shadow-glow-lg ${
                  isDarkMode
                    ? "bg-white/10 border-white/20"
                    : "bg-gray-800 border-gray-700"
                }`}
              >
                <h3 className="text-xl sm:text-2xl font-mono text-orange-400 mb-4 sm:mb-6 glow-accretion">
                  Contact Information
                </h3>

                <div className="space-y-4 sm:space-y-6">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={info.label}
                      className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    >
                      <div className="p-1.5 sm:p-2 bg-orange-400/20 rounded-lg flex-shrink-0">
                        <info.icon className="text-orange-400" size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-mono text-white font-medium mb-1 text-sm sm:text-base">
                          {info.label}
                        </h4>
                        <p className="text-orange-400 font-mono text-xs sm:text-sm mb-1 break-all">
                          {info.value}
                        </p>
                        <p className="text-white/60 text-xs leading-relaxed">
                          {info.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Resume Download */}
              <motion.div
                className={`bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6 ${
                  isDarkMode
                    ? "bg-white/10 border-white/20"
                    : "bg-white border-gray-200"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <h3 className="text-xl font-mono text-white mb-4">
                  Resume & Portfolio
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Download my complete resume including technical skills,
                  project experience, and educational background.
                </p>
                <motion.button
                  onClick={handleDownloadResume}
                  className={`flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-gray-900 font-mono font-medium rounded-full hover:from-orange-300 hover:to-orange-400 transition-all duration-300 w-full justify-center glow-accretion event-horizon-hover border border-gray-300`}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(251, 146, 60, 0.4)",
                      "0 0 0 10px rgba(251, 146, 60, 0)",
                      "0 0 0 0 rgba(251, 146, 60, 0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FileText size={18} />
                  Download Resume
                </motion.button>
              </motion.div>

              {/* Status Indicator */}
              <motion.div
                className={`bg-black/40 backdrop-blur-sm border border-green-400/20 rounded-lg p-4 ${
                  isDarkMode
                    ? "bg-white/10 border-white/20"
                    : "bg-gray-800 border-gray-700"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-3 h-3 bg-green-400 rounded-full"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="font-mono text-green-400 text-sm">
                    Available for new opportunities
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              className={`glass-morphism-dark noise-texture rounded-xl p-4 sm:p-6 shadow-glow-lg ${
                isDarkMode
                  ? "bg-white/10 border-white/20"
                  : "bg-white border-gray-300"
              }`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <h3
                className={`text-xl sm:text-2xl font-mono mb-4 sm:mb-6 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Send Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block mb-2 font-mono text-sm ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full p-3 rounded-lg border outline-none font-mono text-base transition-all duration-200 ${
                          isDarkMode
                            ? "bg-white/10 border-white/20 text-white"
                            : "bg-gray-800 border-gray-700 text-gray-900"
                        }`}
                        placeholder="Enter your name"
                        maxLength={charLimits.name}
                      />
                      {fieldTouched.name &&
                        !fieldErrors.name &&
                        formData.name && (
                          <CheckCircle
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400"
                            size={16}
                          />
                        )}
                      {fieldTouched.name && fieldErrors.name && (
                        <AlertCircle
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400"
                          size={16}
                        />
                      )}
                    </div>
                    {fieldTouched.name && fieldErrors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs font-mono mt-1"
                      >
                        {fieldErrors.name}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label
                      className={`block mb-2 font-mono text-sm ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full p-3 rounded-lg border outline-none font-mono text-base transition-all duration-200 ${
                          isDarkMode
                            ? "bg-white/10 border-white/20 text-white"
                            : "bg-gray-800 border-gray-700 text-gray-900"
                        }`}
                        placeholder="your.email@domain.com"
                      />
                      {fieldTouched.email &&
                        !fieldErrors.email &&
                        formData.email && (
                          <CheckCircle
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400"
                            size={16}
                          />
                        )}
                      {fieldTouched.email && fieldErrors.email && (
                        <AlertCircle
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400"
                          size={16}
                        />
                      )}
                    </div>
                    {fieldTouched.email && fieldErrors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs font-mono mt-1"
                      >
                        {fieldErrors.email}
                      </motion.p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    className={`block mb-2 font-mono text-sm ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Subject
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full p-3 rounded-lg border outline-none font-mono text-base transition-all duration-200 ${
                        isDarkMode
                          ? "bg-white/10 border-white/20 text-white"
                          : "bg-gray-800 border-gray-700 text-gray-900"
                      }`}
                      placeholder="Project inquiry, collaboration, etc."
                      maxLength={charLimits.subject}
                    />
                    {fieldTouched.subject &&
                      !fieldErrors.subject &&
                      formData.subject && (
                        <CheckCircle
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400"
                          size={16}
                        />
                      )}
                    {fieldTouched.subject && fieldErrors.subject && (
                      <AlertCircle
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400"
                        size={16}
                      />
                    )}
                  </div>
                  {fieldTouched.subject && fieldErrors.subject && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs font-mono mt-1"
                    >
                      {fieldErrors.subject}
                    </motion.p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      className={`block mb-2 font-mono text-sm ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Message
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setUseAI(!useAI);
                          if (!useAI && formData.message.length > 10) {
                            console.log(
                              "🤖 AI toggled ON, generating suggestions..."
                            );
                            generateAISuggestions(formData.message);
                          }
                        }}
                        className={`text-xs font-mono transition-colors flex items-center gap-1 px-2 py-1 rounded ${
                          useAI
                            ? aiStatus === "success"
                              ? "bg-green-400/20 text-green-400 border border-green-400/30"
                              : aiStatus === "error"
                              ? "bg-red-400/20 text-red-400 border border-red-400/30"
                              : aiStatus === "loading"
                              ? "bg-blue-400/20 text-blue-400 border border-blue-400/30"
                              : "bg-orange-400/20 text-orange-400 border border-orange-400/30"
                            : "text-white/60 hover:text-orange-300 border border-white/20"
                        }`}
                      >
                        🤖 AI{" "}
                        {useAI
                          ? aiStatus === "success"
                            ? "✅"
                            : aiStatus === "error"
                            ? "❌"
                            : aiStatus === "loading"
                            ? "⏳"
                            : "ON"
                          : "OFF"}
                      </button>
                      {useAI && formData.message.length > 10 && (
                        <button
                          type="button"
                          onClick={() => {
                            console.log("🔄 Manual AI trigger");
                            generateAISuggestions(formData.message);
                          }}
                          className="text-xs text-blue-400 hover:text-blue-300 font-mono transition-colors flex items-center gap-1 px-2 py-1 rounded border border-blue-400/30"
                          disabled={isLoadingAI}
                        >
                          {isLoadingAI ? "⏳" : "🔄"} Generate
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setShowSuggestions(!showSuggestions);
                          setSelectedSuggestionIndex(-1);
                        }}
                        className="text-xs text-orange-400 hover:text-orange-300 font-mono transition-colors flex items-center gap-1"
                      >
                        <MessageSquare size={12} />
                        {showSuggestions ? "Hide" : "Add"} suggestions
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onFocus={handleMessageFocus}
                      onKeyDown={handleMessageKeyDown}
                      rows={6}
                      className={`w-full p-3 rounded-lg border outline-none font-mono text-base transition-all duration-200 resize-none ${
                        isDarkMode
                          ? "bg-white/10 border-white/20 text-white"
                          : "bg-gray-800 border-gray-700 text-gray-900"
                      }`}
                      placeholder="Tell me about your project or how we can work together... (click 'Add suggestions' for quick phrases)"
                      maxLength={charLimits.message}
                    />

                    {/* Autocomplete Suggestions Dropdown */}
                    {showSuggestions &&
                      (() => {
                        const filteredSuggestions = getYouTubeLikeSuggestions();
                        return (
                          <div className="absolute left-0 right-0 z-20 mt-2 bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg shadow-lg max-h-60 overflow-y-auto animate-fade-in">
                            {isLoadingAI && (
                              <div className="flex items-center justify-center py-4">
                                <span className="animate-spin rounded-full h-8 w-8 border-4 border-orange-400 border-t-transparent mr-2"></span>
                                <span className="text-orange-500 font-mono font-semibold text-base">
                                  Generating smart suggestions...
                                </span>
                              </div>
                            )}
                            {filteredSuggestions.length === 0 &&
                              !isLoadingAI && (
                                <div className="px-4 py-3 text-gray-400 text-center font-mono text-base">
                                  No suggestions available for this context.
                                </div>
                              )}
                            {filteredSuggestions.map(
                              (suggestion: string, index: number) => (
                                <motion.button
                                  key={suggestion}
                                  type="button"
                                  data-suggestion-button="true"
                                  onMouseDown={(e) => {
                                    e.preventDefault(); // Prevent blur
                                    handleSuggestionClick(suggestion);
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleSuggestionClick(suggestion);
                                  }}
                                  className={`w-full text-left px-6 py-4 text-base font-semibold font-mono rounded-lg mb-1 transition-colors flex items-center gap-3 border border-transparent
                                  ${
                                    index === selectedSuggestionIndex
                                      ? isDarkMode
                                        ? "bg-orange-500/20 text-orange-300 border-orange-400"
                                        : "bg-orange-100 text-orange-700 border-orange-300"
                                      : isDarkMode
                                      ? "text-white hover:bg-orange-400/10"
                                      : "text-gray-900 hover:bg-orange-50"
                                  }
                                `}
                                  whileHover={{
                                    backgroundColor: isDarkMode
                                      ? "rgba(251,146,60,0.08)"
                                      : "rgba(251,146,60,0.12)",
                                  }}
                                >
                                  <div
                                    className={
                                      index === selectedSuggestionIndex
                                        ? isDarkMode
                                          ? "text-orange-300"
                                          : "text-orange-500"
                                        : "text-orange-400"
                                    }
                                  >
                                    💡
                                  </div>
                                  <div className="flex-1">{suggestion}</div>
                                </motion.button>
                              )
                            )}
                          </div>
                        );
                      })()}
                    {fieldTouched.message &&
                      !fieldErrors.message &&
                      formData.message && (
                        <CheckCircle
                          className="absolute right-3 top-3 text-green-400"
                          size={16}
                        />
                      )}
                    {fieldTouched.message && fieldErrors.message && (
                      <AlertCircle
                        className="absolute right-3 top-3 text-red-400"
                        size={16}
                      />
                    )}
                  </div>
                  {fieldTouched.message && fieldErrors.message && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs font-mono mt-1"
                    >
                      {fieldErrors.message}
                    </motion.p>
                  )}
                </div>

                {/* Form Status Indicator */}
                {!isFormValid &&
                  (formData.name || formData.email || formData.message) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 ${
                        isDarkMode
                          ? "bg-white/10 border-white/20"
                          : "bg-gray-800 border-gray-700"
                      }`}
                    >
                      <p className="text-yellow-400 text-xs font-mono text-center">
                        Please complete all required fields with valid
                        information
                      </p>
                    </motion.div>
                  )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
                  className={`w-full flex items-center justify-center gap-3 px-6 py-3 font-mono font-medium rounded-full transition-all duration-300 ${
                    isSubmitting || !isFormValid
                      ? "bg-gray-500/50 text-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-400 to-orange-500 text-black hover:from-orange-300 hover:to-orange-400 glow-accretion"
                  }`}
                  whileHover={
                    !isSubmitting && isFormValid ? { scale: 1.02, y: -2 } : {}
                  }
                  whileTap={!isSubmitting && isFormValid ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </motion.button>

                {/* Auto-save Indicator */}
                {(formData.name ||
                  formData.email ||
                  formData.subject ||
                  formData.message) && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white/40 text-xs font-mono text-center"
                  >
                    💾 Form data auto-saved locally
                  </motion.p>
                )}
              </form>
            </motion.div>
          </div>
        </div>

        {/* LinkedIn Profile Link */}
        <div className="flex justify-center mt-8">
          <a
            href="https://www.linkedin.com/in/akshay-juluri-84813928a/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-mono font-semibold rounded-full shadow-lg transition-all duration-200"
            aria-label="Visit my LinkedIn profile"
          >
            {/* LinkedIn SVG Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z" />
            </svg>
            Connect on LinkedIn
          </a>
        </div>

        {/* Success/Error Modal - Prominent and Centered */}
        {showToast && (
          <motion.div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
              isDarkMode
                ? "bg-black/50 backdrop-blur-sm"
                : "bg-white/80 backdrop-blur-sm"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <div
              className={`absolute inset-0 ${
                isDarkMode
                  ? "bg-black/50 backdrop-blur-sm"
                  : "bg-white/80 backdrop-blur-sm"
              }`}
              onClick={() => setShowToast(false)}
            />

            {/* Modal Content */}
            <motion.div
              className={`relative max-w-md w-full mx-4 rounded-2xl shadow-2xl overflow-hidden ${
                toastType === "success"
                  ? "bg-gradient-to-br from-green-500 to-emerald-600"
                  : "bg-gradient-to-br from-red-500 to-rose-600"
              }`}
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
            >
              {/* Success/Error Content */}
              <div className="p-8 text-center text-white">
                {toastType === "success" ? (
                  <>
                    {/* Success Icon */}
                    <motion.div
                      className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                    >
                      <motion.svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                    </motion.div>

                    <motion.h3
                      className="text-2xl font-bold mb-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Message Sent! 🎉
                    </motion.h3>
                  </>
                ) : (
                  <>
                    {/* Error Icon */}
                    <motion.div
                      className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                    >
                      <motion.svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </motion.svg>
                    </motion.div>

                    <motion.h3
                      className="text-2xl font-bold mb-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Oops! Something went wrong
                    </motion.h3>
                  </>
                )}

                <motion.p
                  className="text-white/90 mb-6 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {toastMessage}
                </motion.p>

                <motion.button
                  onClick={() => setShowToast(false)}
                  className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {toastType === "success" ? "Awesome!" : "Got it"}
                </motion.button>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white/30 to-transparent" />
              <div className="absolute -top-2 -right-2 w-20 h-20 bg-white/10 rounded-full blur-xl" />
              <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/10 rounded-full blur-xl" />
            </motion.div>
          </motion.div>
        )}
      </section>
    </EnhancedParallax>
  );
};

export default ContactSection;
