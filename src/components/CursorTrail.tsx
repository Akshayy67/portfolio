import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { useDeviceDetection } from "../hooks/useDeviceDetection";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
  type: "star" | "circle" | "diamond" | "sparkle";
}

const CursorTrail: React.FC = () => {
  const { isDarkMode } = useTheme();
  const deviceInfo = useDeviceDetection();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isOnPlainBackground, setIsOnPlainBackground] = useState(true);

  // Don't render cursor trail on mobile devices or touch devices
  if (deviceInfo.isMobile || deviceInfo.isTouchDevice) {
    return null;
  }

  // Check if cursor is over text or interactive elements
  const checkIfOnPlainBackground = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;

    // Check if cursor is over text elements or interactive elements
    const isOverText =
      target.tagName === "P" ||
      target.tagName === "H1" ||
      target.tagName === "H2" ||
      target.tagName === "H3" ||
      target.tagName === "H4" ||
      target.tagName === "H5" ||
      target.tagName === "H6" ||
      target.tagName === "SPAN" ||
      target.tagName === "A" ||
      target.tagName === "BUTTON" ||
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "LABEL" ||
      target.classList.contains("font-mono") ||
      target.classList.contains("text-") ||
      target.closest("button") ||
      target.closest("a") ||
      target.closest(".navigation") ||
      target.closest(".hero-text") ||
      target.closest("nav");

    setIsOnPlainBackground(!isOverText);
  }, []);

  // Create a new particle
  const createParticle = useCallback((x: number, y: number): Particle => {
    const types: Particle["type"][] = ["star", "circle", "diamond", "sparkle"];
    // Weight the types to favor stars and sparkles for more magical effect
    const weightedTypes = [
      "star",
      "star",
      "sparkle",
      "sparkle",
      "circle",
      "diamond",
    ];

    return {
      id: Date.now() + Math.random(),
      x: x + (Math.random() - 0.5) * 30, // Add more randomness to position
      y: y + (Math.random() - 0.5) * 30,
      size: Math.random() * 5 + 3, // Size between 3-8px
      opacity: Math.random() * 0.6 + 0.4, // Opacity between 0.4-1 for better visibility
      rotation: Math.random() * 360,
      type: weightedTypes[
        Math.floor(Math.random() * weightedTypes.length)
      ] as Particle["type"],
    };
  }, []);

  useEffect(() => {
    let animationFrame: number;
    let lastParticleTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      checkIfOnPlainBackground(e);

      // Only create particles on plain background and throttle creation
      const now = Date.now();
      if (isOnPlainBackground && now - lastParticleTime > 80) {
        // Create particle every 80ms for better performance
        // Create 1-2 particles per trigger for more glitter effect
        const particleCount = Math.random() > 0.7 ? 2 : 1;
        const newParticles = Array.from({ length: particleCount }, () =>
          createParticle(e.clientX, e.clientY)
        );
        setParticles((prev) => [...prev.slice(-12), ...newParticles]); // Keep max 12 particles
        lastParticleTime = now;

        // Debug log occasionally
        if (Math.random() < 0.005) {
          console.log(
            "CursorTrail: Created particles",
            newParticles.length,
            "at",
            e.clientX,
            e.clientY
          );
        }
      }
    };

    // Remove old particles
    const cleanupParticles = () => {
      setParticles((prev) =>
        prev.filter((particle) => {
          const age = Date.now() - particle.id;
          return age < 1500; // Remove particles after 1.5 seconds
        })
      );
      animationFrame = requestAnimationFrame(cleanupParticles);
    };

    document.addEventListener("mousemove", handleMouseMove);
    animationFrame = requestAnimationFrame(cleanupParticles);
    console.log("CursorTrail component mounted and event listeners added");

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrame);
      console.log(
        "CursorTrail component unmounted and event listeners removed"
      );
    };
  }, [isOnPlainBackground, createParticle, checkIfOnPlainBackground]);

  const getParticleComponent = (particle: Particle) => {
    const baseColor = isDarkMode ? "#f97316" : "#4f46e5"; // Orange for dark, purple for light
    const glowColor = isDarkMode ? "#fb923c" : "#6366f1";

    const commonProps = {
      className: `cursor-particle particle-${particle.type}`,
      style: {
        width: particle.size,
        height: particle.size,
        background: baseColor,
        color: baseColor, // For currentColor in CSS filters
        boxShadow: `0 0 ${particle.size * 2}px ${glowColor}`,
        transform: `rotate(${particle.rotation}deg)`,
      },
    };

    switch (particle.type) {
      case "star":
        return (
          <div
            {...commonProps}
            style={{
              ...commonProps.style,
              clipPath:
                "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            }}
          />
        );

      case "diamond":
        return (
          <div
            {...commonProps}
            style={{
              ...commonProps.style,
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            }}
          />
        );

      case "sparkle":
        return (
          <div
            {...commonProps}
            style={{
              ...commonProps.style,
              clipPath:
                "polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)",
            }}
          />
        );

      default: // circle
        return (
          <div
            {...commonProps}
            style={{
              ...commonProps.style,
              borderRadius: "50%",
            }}
          />
        );
    }
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[99998]"
      style={{ position: "fixed", zIndex: 99998 }}
    >
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              left: particle.x,
              top: particle.y,
            }}
            initial={{
              opacity: particle.opacity,
              scale: 0,
              rotate: particle.rotation,
            }}
            animate={{
              opacity: 0,
              scale: 1.5,
              rotate: particle.rotation + 180,
              y: particle.y - 30, // Float upward
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
            }}
          >
            {getParticleComponent(particle)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CursorTrail;
