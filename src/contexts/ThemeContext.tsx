import React, { createContext, useContext, useState, useEffect } from "react";
import { trackThemeChange } from "../services/analytics";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
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

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved theme preference (only on client side)
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      // Default to dark mode if no preference is saved
      return saved === "light" ? false : true;
    }
    return true; // Default to dark mode for SSR
  });

  useEffect(() => {
    // Save theme preference to localStorage (only on client side)
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
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
  }, [isDarkMode]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    console.log("Theme toggled, current:", isDarkMode, "new:", newTheme);
    
    // Track theme change in analytics
    try {
      trackThemeChange(newTheme ? "dark" : "light");
    } catch (error) {
      console.error("Failed to track theme change:", error);
    }
    
    setIsDarkMode(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
