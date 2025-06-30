import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { useDeviceDetection } from "../hooks/useDeviceDetection";

const CustomCursor: React.FC = () => {
  const { isDarkMode } = useTheme();
  const deviceInfo = useDeviceDetection();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState<string>("default");
  const [isVisible, setIsVisible] = useState(true);

  // Don't render custom cursor on mobile devices or touch devices
  if (deviceInfo.isMobile || deviceInfo.isTouchDevice) {
    return null;
  }

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Also update cursor type on mouse move for better responsiveness
      updateCursorType(e);

      // Debug log every 100 mouse moves to avoid spam
      if (Math.random() < 0.01) {
        console.log(
          "Mouse position updated:",
          e.clientX,
          e.clientY,
          "Cursor type:",
          cursorType
        );
      }
    };

    const updateCursorType = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check which section we're in based on element or closest section
      const heroSection =
        target.closest(".hero-section") ||
        target.closest('[data-section="hero"]') ||
        target.closest("#hero");
      const aboutSection =
        target.closest(".about-section") ||
        target.closest('[data-section="about"]') ||
        target.closest("#about");
      const projectsSection =
        target.closest(".projects-section") ||
        target.closest('[data-section="projects"]') ||
        target.closest("#projects");
      const skillsSection =
        target.closest(".skills-section") ||
        target.closest('[data-section="skills"]') ||
        target.closest("#skills");
      const contactSection =
        target.closest(".contact-section") ||
        target.closest('[data-section="contact"]') ||
        target.closest("#contact");

      // Check for specific cursor classes first
      if (target.classList.contains("rocket-cursor")) {
        setCursorType("rocket");
      } else if (target.classList.contains("star-cursor")) {
        setCursorType("star");
      } else if (target.classList.contains("black-hole-cursor")) {
        setCursorType("black-hole");
      } else if (target.classList.contains("audio-cursor")) {
        setCursorType("audio");
      } else if (target.classList.contains("event-horizon-hover")) {
        setCursorType("event-horizon");
      } else if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.getAttribute("role") === "button" ||
        target.classList.contains("cursor-pointer")
      ) {
        setCursorType("pointer");
      } else if (projectsSection) {
        setCursorType("project");
      } else if (aboutSection) {
        setCursorType("about");
      } else if (skillsSection) {
        setCursorType("skills");
      } else if (contactSection) {
        setCursorType("contact");
      } else if (heroSection) {
        setCursorType("hero");
      } else {
        setCursorType("default");
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Add event listeners to document and window for better coverage
    document.addEventListener("mousemove", updateMousePosition);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mousemove", updateMousePosition);

    // Ensure cursor is visible on component mount
    setIsVisible(true);
    console.log("CustomCursor component mounted and event listeners added");

    return () => {
      document.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  const getCursorContent = () => {
    const baseColor = isDarkMode ? "#f97316" : "#4f46e5"; // Orange for dark, purple for light
    const size = cursorType === "pointer" ? 16 : 12;

    switch (cursorType) {
      case "rocket":
        return (
          <div className="relative">
            <div
              className="w-4 h-4 rotate-45"
              style={{
                background: `linear-gradient(45deg, ${baseColor}, ${baseColor}dd)`,
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              }}
            />
            <div
              className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full"
              style={{ transform: "translate(-50%, -50%)" }}
            />
          </div>
        );

      case "star":
        return (
          <div
            className="w-4 h-4"
            style={{
              background: baseColor,
              clipPath:
                "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            }}
          />
        );

      case "black-hole":
        return (
          <div className="relative">
            <div
              className="w-6 h-6 rounded-full border-2 animate-spin"
              style={{
                borderColor: `${baseColor} transparent ${baseColor} transparent`,
                background: `radial-gradient(circle, transparent 30%, ${baseColor}20 50%, transparent 70%)`,
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-black rounded-full"
              style={{ transform: "translate(-50%, -50%)" }}
            />
          </div>
        );

      case "audio":
        return (
          <div className="relative">
            <div
              className="w-3 h-4"
              style={{
                background: baseColor,
                clipPath:
                  "polygon(0 30%, 40% 30%, 70% 0%, 70% 100%, 40% 70%, 0 70%)",
              }}
            />
            <div
              className="absolute -right-1 top-1 w-1 h-2 border border-current rounded-full"
              style={{ borderColor: baseColor }}
            />
          </div>
        );

      case "event-horizon":
        return (
          <div className="relative">
            <div
              className="w-4 h-4 rounded-full border-2 animate-pulse"
              style={{
                borderColor: baseColor,
                background: `radial-gradient(circle, ${baseColor}40, transparent)`,
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full"
              style={{ transform: "translate(-50%, -50%)" }}
            />
          </div>
        );

      case "hero":
        return (
          <div className="relative">
            <div
              className="w-5 h-5 rounded-full"
              style={{
                background: `radial-gradient(circle, ${baseColor}, ${baseColor}80)`,
                boxShadow: `0 0 15px ${baseColor}`,
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full animate-pulse"
              style={{ transform: "translate(-50%, -50%)" }}
            />
          </div>
        );

      case "about":
        return (
          <div
            className="w-4 h-4"
            style={{
              background: baseColor,
              clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
              boxShadow: `0 0 12px ${baseColor}`,
            }}
          />
        );

      case "project":
        return (
          <div className="relative">
            <div
              className="w-4 h-4"
              style={{
                background: baseColor,
                clipPath:
                  "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                boxShadow: `0 0 10px ${baseColor}`,
              }}
            />
            <div className="absolute inset-0 border border-white/30 rounded-sm" />
          </div>
        );

      case "skills":
        return (
          <div className="relative">
            <div
              className="w-4 h-4 rotate-45"
              style={{
                background: `linear-gradient(45deg, ${baseColor}, ${baseColor}cc)`,
                boxShadow: `0 0 8px ${baseColor}`,
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full"
              style={{ transform: "translate(-50%, -50%) rotate(-45deg)" }}
            />
          </div>
        );

      case "contact":
        return (
          <div className="relative">
            <div
              className="w-4 h-4 rounded-full border-2"
              style={{
                borderColor: baseColor,
                background: `conic-gradient(${baseColor}, transparent, ${baseColor})`,
                boxShadow: `0 0 12px ${baseColor}60`,
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full animate-ping"
              style={{ transform: "translate(-50%, -50%)" }}
            />
          </div>
        );

      case "pointer":
        return (
          <div
            className="w-4 h-4 rounded-full border-2 border-white"
            style={{
              background: baseColor,
              boxShadow: `0 0 10px ${baseColor}80`,
            }}
          />
        );

      default:
        return (
          <div
            className="w-3 h-3 rounded-full"
            style={{
              background: baseColor,
              boxShadow: `0 0 8px ${baseColor}60`,
            }}
          />
        );
    }
  };

  return (
    <>
      {/* Debug indicator - Always show for debugging */}
      <div
        style={{
          position: "fixed",
          top: "10px",
          left: "10px",
          background: "red",
          color: "white",
          padding: "5px",
          zIndex: 999999,
          fontSize: "12px",
        }}
      >
        Cursor: {mousePosition.x}, {mousePosition.y} | Type: {cursorType} |
        Visible: {isVisible ? "YES" : "NO"}
      </div>

      {/* Custom cursor */}
      <motion.div
        className="fixed pointer-events-none"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: "translate(-50%, -50%)",
          zIndex: 999999,
        }}
        animate={{
          scale: isVisible ? 1 : 0,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
        }}
      >
        {getCursorContent()}
      </motion.div>

      {/* Cursor glow effect */}
      <motion.div
        className="fixed pointer-events-none"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: "translate(-50%, -50%)",
          zIndex: 999998,
          width: "60px",
          height: "60px",
          background: `radial-gradient(circle, ${
            isDarkMode ? "rgba(249, 115, 22, 0.4)" : "rgba(79, 70, 229, 0.4)"
          } 0%, transparent 70%)`,
          borderRadius: "50%",
        }}
        animate={{
          scale: isVisible ? [1, 1.3, 1] : 0,
          opacity: isVisible ? [0.6, 1, 0.6] : 0,
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Simple fallback cursor for debugging */}
      <div
        style={{
          position: "fixed",
          left: mousePosition.x,
          top: mousePosition.y,
          transform: "translate(-50%, -50%)",
          zIndex: 999997,
          width: "10px",
          height: "10px",
          background: "red",
          borderRadius: "50%",
          pointerEvents: "none",
          border: "2px solid white",
        }}
      />
    </>
  );
};

export default CustomCursor;
