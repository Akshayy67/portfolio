import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";

interface BlackHoleSceneProps {
  onSkip: () => void;
  onComplete?: () => void;
}

const BlackHoleScene: React.FC<BlackHoleSceneProps> = ({
  onSkip,
  onComplete,
}) => {
  // Debug logging
  useEffect(() => {
    console.log("🌌 Gargantua BlackHoleScene component mounted!");
  }, []);

  // Auto-complete after showing Gargantua for a few seconds
  useEffect(() => {
    const completeTimer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 5000); // Show Gargantua for 5 seconds then go to home

    return () => clearTimeout(completeTimer);
  }, [onComplete]);

  return (
    <div
      className="black-hole-cursor"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: "#000000",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Skip Button */}
      <motion.button
        onClick={onSkip}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-6 py-3 bg-orange-500/80 text-white rounded-full hover:bg-orange-400 transition-all duration-300 font-mono text-sm shadow-lg backdrop-blur-sm border border-orange-400/30 rocket-cursor"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Play size={16} />
        Skip Intro
      </motion.button>

      {/* Keyboard hint */}
      <motion.div
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 text-white/60 text-sm font-mono text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Press <span className="text-orange-400">SPACE</span> or{" "}
        <span className="text-orange-400">ENTER</span> to skip
      </motion.div>

      {/* Enhanced Background Stars */}
      <div className="absolute inset-0">
        {[...Array(300)].map((_, i) => {
          const size = Math.random() * 3 + 1;
          const isColoredStar = Math.random() > 0.8;
          const starColor = isColoredStar
            ? Math.random() > 0.5
              ? "bg-orange-400"
              : Math.random() > 0.5
              ? "bg-blue-400"
              : "bg-purple-400"
            : "bg-white";

          return (
            <motion.div
              key={i}
              className={`absolute ${starColor} rounded-full`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                filter: isColoredStar
                  ? `drop-shadow(0 0 ${size * 2}px currentColor)`
                  : "none",
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      {/* Deep Space Nebula */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 1200px 600px at 30% 40%, rgba(147, 51, 234, 0.08), transparent),
            radial-gradient(ellipse 800px 400px at 70% 60%, rgba(59, 130, 246, 0.06), transparent),
            radial-gradient(ellipse 600px 300px at 50% 80%, rgba(251, 146, 60, 0.04), transparent)
          `,
        }}
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Cosmic Dust Particles */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={`dust-${i}`}
          className="absolute bg-white/20 rounded-full"
          style={{
            width: "1px",
            height: "1px",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, (Math.random() - 0.5) * 100],
            y: [0, (Math.random() - 0.5) * 100],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        />
      ))}

      {/* Gargantua Black Hole */}
      <motion.div
        className="relative"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <GargantuaBlackHole />
      </motion.div>

      {/* Gargantua Text Overlay */}
      <motion.div
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          className="font-mono text-orange-400 text-2xl mb-2 font-bold"
          animate={{
            textShadow: [
              "0 0 10px rgba(251, 146, 60, 0.5)",
              "0 0 20px rgba(251, 146, 60, 0.8)",
              "0 0 15px rgba(251, 146, 60, 0.6)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          Approaching Gargantua...
        </motion.div>
        <div className="font-mono text-white/60 text-lg">
          Extreme gravitational time dilation detected
        </div>
        <motion.div
          className="font-mono text-white/40 text-sm mt-2"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          "Those aren't mountains... they're waves."
        </motion.div>
      </motion.div>
    </div>
  );
};

// Gargantua Black Hole - Inspired by Interstellar
const GargantuaBlackHole: React.FC = () => (
  <div className="relative">
    {/* Main Accretion Disk - Gargantua's characteristic orange glow */}
    <motion.div
      className="relative w-[32rem] h-[32rem] rounded-full"
      style={{
        background: `conic-gradient(from 0deg,
          transparent 0deg,
          rgba(251, 146, 60, 0.1) 15deg,
          rgba(251, 146, 60, 0.4) 30deg,
          rgba(255, 165, 0, 0.8) 45deg,
          rgba(255, 255, 255, 1) 60deg,
          rgba(255, 165, 0, 0.8) 75deg,
          rgba(251, 146, 60, 0.4) 90deg,
          rgba(251, 146, 60, 0.1) 105deg,
          transparent 120deg,
          rgba(251, 146, 60, 0.05) 135deg,
          rgba(251, 146, 60, 0.3) 150deg,
          rgba(255, 165, 0, 0.6) 165deg,
          rgba(255, 255, 255, 0.9) 180deg,
          rgba(255, 165, 0, 0.6) 195deg,
          rgba(251, 146, 60, 0.3) 210deg,
          rgba(251, 146, 60, 0.05) 225deg,
          transparent 240deg,
          rgba(251, 146, 60, 0.02) 255deg,
          rgba(251, 146, 60, 0.2) 270deg,
          rgba(255, 165, 0, 0.4) 285deg,
          rgba(255, 255, 255, 0.7) 300deg,
          rgba(255, 165, 0, 0.4) 315deg,
          rgba(251, 146, 60, 0.2) 330deg,
          rgba(251, 146, 60, 0.02) 345deg,
          transparent 360deg
        )`,
        filter: "blur(1px)",
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {/* Event Horizon - The point of no return */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-black rounded-full border border-orange-400/20 shadow-2xl" />
    </motion.div>

    {/* Secondary Accretion Ring */}
    <motion.div
      className="absolute inset-8 rounded-full"
      style={{
        background: `conic-gradient(from 180deg,
          transparent 0deg,
          rgba(251, 146, 60, 0.2) 60deg,
          rgba(255, 165, 0, 0.5) 120deg,
          rgba(255, 255, 255, 0.8) 180deg,
          rgba(255, 165, 0, 0.5) 240deg,
          rgba(251, 146, 60, 0.2) 300deg,
          transparent 360deg
        )`,
        filter: "blur(2px)",
      }}
      animate={{ rotate: -360 }}
      transition={{
        duration: 35,
        repeat: Infinity,
        ease: "linear",
      }}
    />

    {/* Gravitational Lensing - Multiple rings for realistic effect */}
    <motion.div
      className="absolute inset-0 rounded-full"
      style={{
        background: `radial-gradient(circle,
          transparent 15%,
          rgba(251, 146, 60, 0.08) 25%,
          transparent 35%,
          rgba(255, 165, 0, 0.12) 45%,
          transparent 55%,
          rgba(251, 146, 60, 0.06) 65%,
          transparent 75%,
          rgba(255, 255, 255, 0.04) 85%,
          transparent 95%
        )`,
      }}
      animate={{
        scale: [1, 1.05, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />

    {/* Photon Sphere - Light bending around the black hole */}
    <motion.div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 border border-orange-300/30 rounded-full"
      animate={{
        scale: [1, 1.02, 1],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />

    {/* Ergosphere Effect */}
    <motion.div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/10 rounded-full"
      animate={{
        scale: [1, 1.03, 1],
        opacity: [0.2, 0.4, 0.2],
        rotate: [0, 360],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      }}
    />

    {/* Doppler Effect - Red and blue shifted light */}
    <motion.div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72"
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        duration: 30,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {/* Red-shifted side */}
      <div className="absolute top-0 left-1/2 w-1 h-36 bg-gradient-to-t from-transparent to-red-400/20 transform -translate-x-1/2" />
      {/* Blue-shifted side */}
      <div className="absolute bottom-0 left-1/2 w-1 h-36 bg-gradient-to-b from-transparent to-blue-400/20 transform -translate-x-1/2" />
    </motion.div>
  </div>
);

export default BlackHoleScene;
