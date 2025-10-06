import React from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface ResumeDownloadButtonProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
}

const ResumeDownloadButton: React.FC<ResumeDownloadButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  showIcon = true,
}) => {
  const { isDarkMode } = useTheme();

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    primary: `${
      isDarkMode
        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
        : "bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600"
    } shadow-lg shadow-orange-500/50`,
    secondary: `${
      isDarkMode
        ? "bg-white/10 text-white border border-white/20 hover:bg-white/20"
        : "bg-gray-100 text-gray-900 border border-gray-200 hover:bg-gray-200"
    }`,
    outline: `${
      isDarkMode
        ? "border-2 border-orange-400 text-orange-400 hover:bg-orange-400/10"
        : "border-2 border-orange-500 text-orange-500 hover:bg-orange-50"
    }`,
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <motion.a
      href="/resume.pdf"
      download="Akshay_Juluri_Resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center justify-center gap-2 
        font-mono font-semibold rounded-lg
        transition-all duration-300
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      whileHover={{
        scale: 1.05,
        y: -2,
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      {showIcon && (
        <motion.div
          animate={{
            y: [0, -3, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Download size={iconSizes[size]} />
        </motion.div>
      )}
      <span>Download Resume</span>
      
      {/* Animated glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at center, ${
            isDarkMode ? "rgba(251, 146, 60, 0.3)" : "rgba(249, 115, 22, 0.2)"
          }, transparent)`,
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.a>
  );
};

export default ResumeDownloadButton;

