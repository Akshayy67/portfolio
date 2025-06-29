import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";

interface LaunchSequenceProps {
  onSkip: () => void;
}

const LaunchSequence: React.FC<LaunchSequenceProps> = ({ onSkip }) => {
  const [countdown, setCountdown] = useState(3);
  const [phase, setPhase] = useState<"countdown" | "launch" | "travel">(
    "countdown"
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          setPhase("launch");
          return 0;
        }
      });
    }, 1000);

    setTimeout(() => {
      setPhase("travel");
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Skip Button */}
      <motion.button
        onClick={onSkip}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-6 py-3 bg-orange-500/80 text-white rounded-full hover:bg-orange-400 transition-all duration-300 font-mono text-sm shadow-lg backdrop-blur-sm border border-orange-400/30"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
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
        transition={{ delay: 2 }}
      >
        Press <span className="text-orange-400">SPACE</span> or{" "}
        <span className="text-orange-400">ENTER</span> to skip
      </motion.div>

      {/* Stars Background */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Countdown */}
      <AnimatePresence>
        {phase === "countdown" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <motion.div
                className="font-mono text-6xl md:text-8xl text-orange-400 mb-4"
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {countdown > 0 ? `T-${countdown}` : "IGNITION!"}
              </motion.div>
              <div className="font-mono text-white/60 text-xl">
                {countdown > 0
                  ? "Preparing for launch..."
                  : "Engines firing..."}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rocket Launch */}
      <AnimatePresence>
        {phase === "launch" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative"
              initial={{ y: 200, scale: 1 }}
              animate={{ y: -800, scale: 0.3 }}
              transition={{ duration: 2, ease: "easeIn" }}
            >
              {/* Rocket */}
              <div className="w-4 h-16 bg-white rounded-t-full relative">
                {/* Exhaust Trail */}
                <motion.div
                  className="absolute top-full left-1/2 transform -translate-x-1/2 w-8 bg-gradient-to-b from-orange-400 via-red-500 to-transparent"
                  style={{ height: "120px" }}
                  animate={{
                    height: ["60px", "120px", "180px"],
                    opacity: [0.8, 1, 0.6],
                  }}
                  transition={{
                    duration: 0.3,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warp Speed Effect */}
      <AnimatePresence>
        {phase === "travel" && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-white h-px"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transformOrigin: "left center",
                }}
                initial={{ width: "2px", scaleX: 0 }}
                animate={{
                  width: "200px",
                  scaleX: 1,
                  x: [0, window.innerWidth],
                }}
                transition={{
                  duration: 1.5,
                  delay: Math.random() * 0.5,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LaunchSequence;
