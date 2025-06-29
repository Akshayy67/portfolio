import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  isAutoTheme: boolean;
  toggleAutoTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

// Helper function to determine if it should be dark mode based on time
const getAutoThemeBasedOnTime = (): boolean => {
  const hour = new Date().getHours();
  // Dark mode during night hours (22:00 - 05:59), light mode during day (06:00 - 21:59)
  return hour >= 22 || hour < 6;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isAutoTheme, setIsAutoTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const autoTheme = localStorage.getItem("autoTheme");
      return autoTheme !== "false"; // Default to auto theme enabled
    }
    return true; // Default to auto theme for SSR
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved theme preference (only on client side)
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      const autoTheme = localStorage.getItem("autoTheme");

      // If auto theme is enabled or no preference is saved, use time-based theme
      if (autoTheme !== "false") {
        const timeBasedTheme = getAutoThemeBasedOnTime();
        // Save the auto-determined theme
        localStorage.setItem("theme", timeBasedTheme ? "dark" : "light");
        localStorage.setItem("autoTheme", "true");
        return timeBasedTheme;
      }

      return saved === "dark";
    }
    return getAutoThemeBasedOnTime(); // Use time-based theme for SSR
  });

  // Effect to handle automatic theme updates based on time
  useEffect(() => {
    if (!isAutoTheme) return;

    const updateThemeBasedOnTime = () => {
      const timeBasedTheme = getAutoThemeBasedOnTime();
      if (timeBasedTheme !== isDarkMode) {
        console.log("Auto theme update:", timeBasedTheme ? "dark" : "light");
        setIsDarkMode(timeBasedTheme);
      }
    };

    // Check immediately
    updateThemeBasedOnTime();

    // Set up interval to check every minute
    const interval = setInterval(updateThemeBasedOnTime, 60000);

    return () => clearInterval(interval);
  }, [isAutoTheme, isDarkMode]);

  useEffect(() => {
    // Save theme preference to localStorage (only on client side)
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
      localStorage.setItem("autoTheme", isAutoTheme.toString());
    }

    // Update document class for global styling
    if (typeof document !== "undefined") {
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      }
    }
  }, [isDarkMode, isAutoTheme]);

  const toggleTheme = () => {
    console.log("Theme toggled, current:", isDarkMode, "new:", !isDarkMode);
    // When manually toggling, disable auto theme
    setIsAutoTheme(false);
    setIsDarkMode((prev) => !prev);
  };

  const toggleAutoTheme = () => {
    const newAutoTheme = !isAutoTheme;
    console.log("Auto theme toggled:", newAutoTheme);
    setIsAutoTheme(newAutoTheme);

    // If enabling auto theme, immediately apply time-based theme
    if (newAutoTheme) {
      const timeBasedTheme = getAutoThemeBasedOnTime();
      setIsDarkMode(timeBasedTheme);
    }
  };

  return (
    <ThemeContext.Provider
      value={{ isDarkMode, toggleTheme, isAutoTheme, toggleAutoTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
