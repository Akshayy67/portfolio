import React from "react";
import { motion } from "framer-motion";
import { useDeviceDetection } from "../hooks/useDeviceDetection";
import { useTheme } from "../contexts/ThemeContext";

interface FooterBackgroundProps {
  className?: string;
}

const FooterBackground: React.FC<FooterBackgroundProps> = ({
  className = "",
}) => {
  const deviceInfo = useDeviceDetection();
  const { isDarkMode } = useTheme();
  const shouldAnimate = !deviceInfo.prefersReducedMotion;

  return (
    <div className={`relative w-full h-80 overflow-hidden ${className}`}>
      {/* Base lunar surface */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-800 to-black" />

      {/* Starry background */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-200 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
            animate={
              shouldAnimate
                ? {
                    opacity: [0.2, 1, 0.2],
                    scale: [1, 1.2, 1],
                  }
                : {}
            }
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Earth in the distance */}
      <motion.div
        className="absolute top-8 right-20 w-16 h-16 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #3b82f6, #1e3a8a, #0f172a)",
          boxShadow:
            "0 0 30px rgba(59, 130, 246, 0.4), inset -8px -8px 0 rgba(0, 0, 0, 0.3)",
        }}
        animate={
          shouldAnimate
            ? {
                rotate: 360,
              }
            : {}
        }
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* Earth's atmosphere glow */}
        <div className="absolute inset-0 rounded-full bg-blue-400/20 scale-125" />
      </motion.div>

      {/* Moon horizon with craters */}
      <div className="absolute bottom-0 left-0 right-0 h-32">
        <svg viewBox="0 0 1200 200" className="w-full h-full">
          {/* Main horizon line */}
          <path
            d="M0,120 Q200,100 400,110 T800,105 Q1000,100 1200,115 L1200,200 L0,200 Z"
            fill="url(#lunarGradient)"
          />

          {/* Crater silhouettes */}
          <ellipse
            cx="300"
            cy="140"
            rx="25"
            ry="8"
            fill="#1f2937"
            opacity="0.6"
          />
          <ellipse
            cx="700"
            cy="135"
            rx="18"
            ry="6"
            fill="#1f2937"
            opacity="0.4"
          />
          <ellipse
            cx="950"
            cy="145"
            rx="30"
            ry="10"
            fill="#1f2937"
            opacity="0.5"
          />

          <defs>
            <linearGradient
              id="lunarGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#374151" />
              <stop offset="100%" stopColor="#1f2937" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Foreground glowing lunar rocks */}
      {shouldAnimate && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-0 bg-blue-500/30 rounded-t-full"
              style={{
                left: `${i * 15 + Math.random() * 10}%`,
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 15 + 8}px`,
                opacity: 0.6 - i * 0.05,
              }}
              animate={{
                y: [0, -2, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </>
      )}

      {/* Futuristic space station */}
      <motion.div
        className="absolute bottom-8 right-1/4"
        animate={
          shouldAnimate
            ? {
                opacity: [0.7, 1, 0.7],
              }
            : {}
        }
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      >
        {/* Main structure */}
        <div className="w-12 h-8 bg-gray-600 relative">
          {/* Communication tower */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-gray-500" />
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-blue-400/60" />
          {/* Windows */}
          <div className="absolute top-1 left-1 w-1 h-1 bg-blue-300/40 rounded-full" />
          <div className="absolute top-1 right-1 w-1 h-1 bg-blue-300/40 rounded-full" />
        </div>
      </motion.div>

      {/* Atmospheric haze effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-900/10 to-blue-800/20 pointer-events-none" />

      {/* Lunar dust particles */}
      {shouldAnimate && (
        <>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-gray-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: `${Math.random() * 30}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                x: [0, 5, 0],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </>
      )}

      {/* Soft blue ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 via-transparent to-blue-800/5 pointer-events-none" />
    </div>
  );
};

export default FooterBackground;
