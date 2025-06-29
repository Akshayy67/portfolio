import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Clock, Settings } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import {
  trackThemeChange,
  updateLocalAnalytics,
  getLocalAnalytics,
} from "../services/analytics";

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme, isAutoTheme, toggleAutoTheme } = useTheme();
  const [showOptions, setShowOptions] = useState(false);

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
      data: { theme: newTheme, mode: "manual" },
    });
    updateLocalAnalytics(analytics);
  };

  const handleAutoToggle = () => {
    toggleAutoTheme();

    // Track auto theme toggle
    const analytics = getLocalAnalytics();
    analytics.events.push({
      timestamp: Date.now(),
      type: "auto_theme_toggle",
      data: { enabled: !isAutoTheme },
    });
    updateLocalAnalytics(analytics);
  };

  return (
    <div className="fixed top-20 right-4 z-50">
      {/* Main Theme Toggle Button */}
      <motion.button
        onClick={handleToggle}
        className={`
          p-3 rounded-full star-cursor mb-2 block
          ${
            isDarkMode
              ? "bg-white/10 text-orange-400 hover:bg-white/20 border-white/20"
              : "bg-white/90 text-orange-600 hover:bg-white border-orange-200 shadow-lg"
          }
          backdrop-blur-md border
          transition-all duration-500 shadow-glow-md
          ${isAutoTheme ? "ring-2 ring-orange-400/50" : ""}
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        title={
          isAutoTheme
            ? "Auto theme enabled (click to manually toggle)"
            : "Manual theme control"
        }
      >
        <motion.div
          key={isDarkMode ? "dark" : "light"}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 180, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {isDarkMode ? (
            <Sun size={20} className="drop-shadow-lg" />
          ) : (
            <Moon size={20} className="drop-shadow-lg" />
          )}
          {isAutoTheme && (
            <Clock
              size={8}
              className="absolute -top-1 -right-1 text-orange-400 animate-pulse"
            />
          )}
        </motion.div>
      </motion.button>

      {/* Settings Button */}
      <motion.button
        onClick={() => setShowOptions(!showOptions)}
        className={`
          p-2 rounded-full star-cursor block
          ${
            isDarkMode
              ? "bg-white/5 text-orange-400/70 hover:bg-white/10 border-white/10"
              : "bg-white/70 text-orange-600/70 hover:bg-white/90 border-orange-200/50 shadow-md"
          }
          backdrop-blur-md border
          transition-all duration-300
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
        title="Theme settings"
      >
        <Settings size={14} />
      </motion.button>

      {/* Options Panel */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`
              absolute top-0 right-full mr-3 p-3 rounded-lg min-w-[200px]
              ${
                isDarkMode
                  ? "bg-black/80 text-white border-white/20"
                  : "bg-white/95 text-gray-900 border-orange-200/50 shadow-xl"
              }
              backdrop-blur-md border
            `}
          >
            <div className="text-xs font-medium mb-2 opacity-70">
              Theme Settings
            </div>

            <button
              onClick={handleAutoToggle}
              className={`
                w-full text-left p-2 rounded text-sm transition-all duration-200
                ${
                  isAutoTheme
                    ? isDarkMode
                      ? "bg-orange-400/20 text-orange-400"
                      : "bg-orange-100 text-orange-700"
                    : isDarkMode
                    ? "hover:bg-white/10"
                    : "hover:bg-gray-100"
                }
              `}
            >
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>Auto Theme</span>
                {isAutoTheme && (
                  <span className="ml-auto text-xs opacity-70">ON</span>
                )}
              </div>
              <div className="text-xs opacity-60 mt-1">
                {isAutoTheme
                  ? "Switches based on time of day"
                  : "Manual theme control"}
              </div>
            </button>

            <div className="text-xs opacity-50 mt-2 pt-2 border-t border-current/10">
              {isAutoTheme
                ? "Dark: 10PM-6AM • Light: 6AM-10PM"
                : "Click main button to toggle theme"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggle;
