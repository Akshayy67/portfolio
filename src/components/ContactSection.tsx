import React, { useState, useEffect } from "react";
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

const ContactSection: React.FC = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

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

  // Character limits
  const charLimits = {
    name: 50,
    subject: 100,
    message: 1000,
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
    setTimeout(() => setShowToast(false), 5000);
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
      // EmailJS configuration from environment variables
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      console.log("EmailJS Config:", {
        serviceId,
        templateId,
        publicKey: publicKey ? "***" : "missing",
      });

      // Check if EmailJS is configured
      if (!serviceId || !templateId || !publicKey) {
        console.error("EmailJS configuration missing:", {
          serviceId,
          templateId,
          publicKey,
        });
        throw new Error("EmailJS not configured");
      }

      // Prepare template parameters (simplified to work with existing template)
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: `Portfolio Contact: ${formData.subject || "New Inquiry"}`,
        message: `
📧 NEW CONTACT FROM PORTFOLIO WEBSITE

👤 FROM: ${formData.name}
📧 EMAIL: ${formData.email}
📝 SUBJECT: ${formData.subject || "General Inquiry"}
🕒 TIME: ${new Date().toLocaleString()}

💬 MESSAGE:
${formData.message}

---
This message was sent from your portfolio website contact form.
Please reply directly to ${formData.email}
        `.trim(),
      };

      console.log("Sending email with params:", templateParams);

      // Send email using EmailJS
      const result = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      console.log("EmailJS result:", result);

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
          "Message sent successfully! I will get back to you soon."
        );
      } else {
        throw new Error("EmailJS failed");
      }
    } catch (error) {
      console.error("EmailJS failed:", error);
      console.log("Using mailto fallback");

      // Fallback: Use mailto approach with better UX
      const messageText = `Name: ${formData.name}\nEmail: ${
        formData.email
      }\nSubject: ${
        formData.subject || "Contact from Portfolio"
      }\n\nMessage:\n${formData.message}`;

      try {
        // Copy to clipboard for user convenience
        await navigator.clipboard.writeText(messageText);

        // Open email client
        const subject = encodeURIComponent(
          formData.subject || "Contact from Portfolio"
        );
        const body = encodeURIComponent(messageText);
        const mailtoLink = `mailto:akshayjuluri6704@gmail.com?subject=${subject}&body=${body}`;

        window.location.href = mailtoLink;

        // Reset form and show success message
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });

        showToastMessage(
          "Email client opened with your message! Message also copied to clipboard. Please send the email to complete your inquiry."
        );
      } catch (clipboardError) {
        // If clipboard fails, still open email client
        const subject = encodeURIComponent(
          formData.subject || "Contact from Portfolio"
        );
        const body = encodeURIComponent(messageText);
        const mailtoLink = `mailto:akshayjuluri6704@gmail.com?subject=${subject}&body=${body}`;

        window.location.href = mailtoLink;

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });

        showToastMessage(
          "Email client opened with your message! Please send the email to complete your inquiry."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadResume = () => {
    // Create a well-formatted HTML resume
    const resumeHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Julubi Akshay - Resume</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { margin: 0; font-size: 2.5em; color: #2c3e50; }
        .contact-info { margin: 10px 0; font-size: 1.1em; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #2c3e50; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; }
        .education-item, .project-item { margin-bottom: 20px; }
        .education-item h3, .project-item h3 { margin: 0; color: #34495e; }
        .education-details { color: #7f8c8d; font-style: italic; }
        .skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .skill-category { margin-bottom: 10px; }
        .skill-category strong { color: #2c3e50; }
        ul { padding-left: 20px; }
        li { margin-bottom: 5px; }
        .project-tech { color: #e67e22; font-weight: bold; margin-top: 5px; }
        .achievement { margin-bottom: 10px; }
        .achievement::before { content: "🏆 "; }
    </style>
</head>
<body>
    <div class="header">
        <h1>JULUBI AKSHAY</h1>
        <div class="contact-info">
            📧 akshayjuluri6704@gmail.com | 📱 7382005522<br>
            🔗 <a href="https://github.com/Akshayy67" target="_blank" rel="noopener noreferrer" style="color: #FFA500;">GitHub</a> | 💼 <a href="https://www.linkedin.com/in/akshay-juluri-84813928a/" target="_blank" rel="noopener noreferrer" style="color: #FFA500;">LinkedIn</a>
        </div>
    </div>

    <div class="section">
        <h2>EDUCATION</h2>
        <div class="education-item">
            <h3>Sreenidhi Institute of Science and Technology (SNIST)</h3>
            <div class="education-details">Computer Science and Engineering, B.Tech | CGPA: 7.9 | 2022 - 2026 | Ghatkesar</div>
        </div>
        <div class="education-item">
            <h3>Narayana Junior College</h3>
            <div class="education-details">MPC Intermediate | Percentage: 97.8% | 2020 - 2022 | Hyderabad</div>
        </div>
        <div class="education-item">
            <h3>St Peters Grammar School</h3>
            <div class="education-details">SSC (10th Board) | GPA: 10 | 2019 - 2020 | Hyderabad</div>
        </div>
    </div>

    <div class="section">
        <h2>SKILLS</h2>
        <div class="skills-grid">
            <div class="skill-category"><strong>Programming Languages:</strong> C, Java, Python, Dart, JavaScript</div>
            <div class="skill-category"><strong>Libraries/Frameworks:</strong> Flutter, TensorFlow, NumPy, Pandas</div>
            <div class="skill-category"><strong>Tools/Platforms:</strong> Git, GitHub, VS Code, Android Studio</div>
            <div class="skill-category"><strong>Databases:</strong> SQL, MongoDB</div>
        </div>
    </div>

    <div class="section">
        <h2>PROJECTS / OPEN-SOURCE</h2>

        <div class="project-item">
            <h3>Predicting Taxi Fares Using Random Forests</h3>
            <div class="project-tech">Python, Pandas, NumPy, Scikit-learn</div>
            <ul>
                <li>Built a predictive model for estimating taxi fares using features like distance, location, and time</li>
                <li>Collected and preprocessed real-world taxi fare datasets</li>
                <li>Trained a Random Forest model achieving 85% accuracy</li>
                <li>Visualized results using Matplotlib and Seaborn</li>
            </ul>
        </div>

        <div class="project-item">
            <h3>LRU-Cache Implementation</h3>
            <div class="project-tech">HTML, CSS, JavaScript, ServiceNow APIs</div>
            <ul>
                <li>Implemented LRU logic by converting Java doubly linked list and hash map code into JavaScript</li>
                <li>Enhanced user experience with dark/light theme toggle, intuitive visuals, and operation log</li>
                <li>The cache automatically removes the least recently used item when exceeding capacity</li>
            </ul>
        </div>

        <div class="project-item">
            <h3>Equipment Loaner Request App</h3>
            <div class="project-tech">JavaScript, ServiceNow, APIs, No-Code Platform</div>
            <ul>
                <li>Developed a No-Code Loaner App using JavaScript and ServiceNow specific technologies</li>
                <li>Integrated ServiceNow APIs for data handling and automation</li>
                <li>Designed custom tables and forms within the ServiceNow platform</li>
            </ul>
        </div>

        <div class="project-item">
            <h3>QuizApp_Flutter</h3>
            <div class="project-tech">Flutter, Dart</div>
            <ul>
                <li>Built a fully operational Quiz App using Dart</li>
                <li>Implemented state management to enable dynamic screen updates and real-time question result ranking</li>
                <li>Designed a responsive UI with engaging question interfaces</li>
            </ul>
        </div>

        <div class="project-item">
            <h3>FarmSmart AI (UD)</h3>
            <div class="project-tech">HTML, React.js, Node.js, Python</div>
            <ul>
                <li>Developed an AI-powered platform assisting farmers in improving crop production</li>
                <li>Integrated AI for crop health analysis, pest detection, and actionable farming insights</li>
                <li>Implemented real-time weather forecasting using OpenWeatherMap API</li>
            </ul>
        </div>

        <div class="project-item">
            <h3>Contact Manager</h3>
            <div class="project-tech">HTML, JavaScript, SQLite</div>
            <ul>
                <li>Web-based Contact Manager with efficient search, manage, and email contacts</li>
                <li>Integrated Trie (prefix tree) data structure for optimized search performance</li>
                <li>Ensures fast and accurate contact lookups, even with large datasets</li>
            </ul>
        </div>
    </div>

    <div class="section">
        <h2>CERTIFICATIONS</h2>
        <ul>
            <li>Supervised Machine Learning: Regression and Classification - DeepLearning.AI, Stanford University (Coursera)</li>
            <li>500+ solved on Leetcode, #Contest rating - 1,600+</li>
            <li>Juniper Networks Virtual Internship</li>
            <li>ServiceNow SNAF,CAD badges</li>
        </ul>
    </div>

    <div class="section">
        <h2>HONORS & AWARDS</h2>
        <div class="achievement">Won Summer Hackathon at SNIST</div>
        <div class="achievement">100Days Leetcoding badge</div>
        <div class="achievement">Hackathon finalist at SNIST by swedha(IIIT Hyderabad)</div>
    </div>
</body>
</html>`;

    // Create and download the resume as an HTML file
    const blob = new Blob([resumeHTML], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Julubi_Akshay_Resume.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Show success message
    alert(
      "Resume downloaded successfully! You can open the HTML file in your browser and print it as PDF if needed."
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setFieldTouched({
      ...fieldTouched,
      [name]: true,
    });
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

  return (
    <section
      id="contact"
      className="min-h-screen py-20 relative overflow-hidden"
    >
      {/* Background Signal Animation */}
      <div className="absolute inset-0">
        {/* Radar Sweep Effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="w-96 h-96 border border-orange-400/20 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 w-96 h-96 border border-orange-400/10 rounded-full"
            animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, delay: 1 }}
          />
        </div>

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
      </div>

      <div ref={ref} className="max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 text-shadow-soft">
            Get In <span className="interstellar-text">Touch</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Ready to collaborate on your next project? Let's connect and build
            something amazing together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="glass-morphism-dark noise-texture rounded-xl p-6 shadow-glow-lg">
              <h3 className="text-2xl font-mono text-orange-400 mb-6 glow-accretion">
                Contact Information
              </h3>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.label}
                    className="flex items-start gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  >
                    <div className="p-2 bg-orange-400/20 rounded-lg">
                      <info.icon className="text-orange-400" size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-mono text-white font-medium mb-1">
                        {info.label}
                      </h4>
                      <p className="text-orange-400 font-mono text-sm mb-1">
                        {info.value}
                      </p>
                      <p className="text-white/60 text-xs">
                        {info.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Resume Download */}
            <motion.div
              className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <h3 className="text-xl font-mono text-white mb-4">
                Resume & Portfolio
              </h3>
              <p className="text-white/70 text-sm mb-4">
                Download my complete resume including technical skills, project
                experience, and educational background.
              </p>
              <motion.button
                onClick={handleDownloadResume}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-black font-mono font-medium rounded-full hover:from-orange-300 hover:to-orange-400 transition-all duration-300 w-full justify-center glow-accretion event-horizon-hover"
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
              className="bg-black/40 backdrop-blur-sm border border-green-400/20 rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
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
            className="glass-morphism-dark noise-texture rounded-xl p-6 shadow-glow-lg"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h3 className="text-2xl font-mono text-white mb-6">Send Message</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm font-mono mb-2">
                    <User size={16} className="inline mr-2" />
                    Your Name *
                    <span className="text-xs text-white/50 ml-2">
                      ({formData.name.length}/{charLimits.name})
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full glass-morphism rounded-xl px-4 py-3 text-white font-mono transition-all duration-300 event-horizon-hover ${
                        fieldTouched.name && fieldErrors.name
                          ? "border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400"
                          : "focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
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
                  <label className="block text-white/70 text-sm font-mono mb-2">
                    <Mail size={16} className="inline mr-2" />
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white font-mono transition-colors ${
                        fieldTouched.email && fieldErrors.email
                          ? "border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400"
                          : "focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
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
                <label className="block text-white/70 text-sm font-mono mb-2">
                  <MessageSquare size={16} className="inline mr-2" />
                  Subject
                  <span className="text-xs text-white/50 ml-2">
                    ({formData.subject.length}/{charLimits.subject})
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white font-mono transition-colors ${
                      fieldTouched.subject && fieldErrors.subject
                        ? "border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400"
                        : "focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
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
                <label className="block text-white/70 text-sm font-mono mb-2">
                  <FileText size={16} className="inline mr-2" />
                  Message *
                  <span className="text-xs text-white/50 ml-2">
                    ({formData.message.length}/{charLimits.message})
                  </span>
                </label>
                <div className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={6}
                    className={`w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white font-mono transition-colors resize-none ${
                      fieldTouched.message && fieldErrors.message
                        ? "border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400"
                        : "focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                    }`}
                    placeholder="Tell me about your project or how we can work together..."
                    maxLength={charLimits.message}
                  />
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
                    className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3"
                  >
                    <p className="text-yellow-400 text-xs font-mono text-center">
                      Please complete all required fields with valid information
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

      {/* Toast Notification */}
      {showToast && (
        <motion.div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg font-mono text-sm max-w-md ${
            toastType === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3">
            {toastType === "success" ? (
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            ) : (
              <div className="w-2 h-2 bg-white rounded-full" />
            )}
            <span>{toastMessage}</span>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default ContactSection;
