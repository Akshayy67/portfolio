import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import {
  trackThemeChange,
  updateLocalAnalytics,
  getLocalAnalytics,
} from "../services/analytics";

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const handleToggle = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    toggleTheme();

    // Track theme change
    trackThemeChange(newTheme);

    // Update local analytics
    const analytics = getLocalAnalytics();
    analytics.events.push({
      timestamp: Date.now(),
      type: "theme_change",
      data: { theme: newTheme },
    });
    updateLocalAnalytics(analytics);
  };

  return (
    <motion.button
      onClick={handleToggle}
      className={`
        fixed top-20 right-4 z-50 p-3 rounded-full star-cursor
        ${
          isDarkMode
            ? "bg-white/10 text-orange-400 hover:bg-white/20 border-white/20"
            : "bg-white/90 text-orange-600 hover:bg-white border-orange-200 shadow-lg"
        }
        backdrop-blur-md border
        transition-all duration-500 shadow-glow-md
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
    >
      <motion.div
        key={isDarkMode ? "dark" : "light"}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 180, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDarkMode ? (
          <Sun size={20} className="drop-shadow-lg" />
        ) : (
          <Moon size={20} className="drop-shadow-lg" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
