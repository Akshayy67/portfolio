import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";
import { audioManager } from "../utils/audioManager";

interface LaunchSequenceProps {
  onSkip: () => void;
}

const LaunchSequence: React.FC<LaunchSequenceProps> = ({ onSkip }) => {
  const [countdown, setCountdown] = useState(3);
  const [phase, setPhase] = useState<
    "countdown" | "ignition" | "launch" | "travel"
  >("countdown");
  const [windowWidth, setWindowWidth] = useState(1920);
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const [audioActive, setAudioActive] = useState(false);

  // Set window width on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);

      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Debug logging and audio initialization
  useEffect(() => {
    console.log("🚀 LaunchSequence component mounted!");
    console.log("Initial phase:", phase, "countdown:", countdown);

    // Initialize audio and start rocket launch sequence sounds after user interaction
    const initializeAudio = async () => {
      try {
        await audioManager.initialize();
        setAudioActive(true);
        await audioManager.playRocketLaunchSequence();
        console.log("🎵 Rocket launch audio sequence started");

        // Turn off audio indicator after sequence completes
        setTimeout(() => setAudioActive(false), 6000);
      } catch (error) {
        console.warn("Failed to initialize launch audio:", error);
      }
    };

    // Wait for user interaction before starting audio
    const handleUserInteraction = () => {
      initializeAudio();
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };

    // Add event listeners for user interaction
    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);
    document.addEventListener("touchstart", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    console.log("🚀 Phase changed to:", phase, "countdown:", countdown);
  }, [phase, countdown]);

  useEffect(() => {
    let countdownTimer: NodeJS.Timeout;
    let ignitionTimer: NodeJS.Timeout;
    let launchTimer: NodeJS.Timeout;
    let travelTimer: NodeJS.Timeout;

    // Start countdown
    countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) {
          return prev - 1;
        } else {
          clearInterval(countdownTimer);
          setPhase("ignition");
          return 0;
        }
      });
    }, 600); // Faster countdown for 6-second total

    // Ignition phase with screen shake
    ignitionTimer = setTimeout(() => {
      setShakeIntensity(5);
      setTimeout(() => setPhase("launch"), 800); // Shorter ignition
    }, 2400); // 3 seconds countdown + ignition

    // Launch phase
    launchTimer = setTimeout(() => {
      setShakeIntensity(10);
    }, 3200);

    // Travel phase
    travelTimer = setTimeout(() => {
      setShakeIntensity(0);
      setPhase("travel");
    }, 4500); // Complete within 6 seconds

    return () => {
      clearInterval(countdownTimer);
      clearTimeout(ignitionTimer);
      clearTimeout(launchTimer);
      clearTimeout(travelTimer);
    };
  }, []);

  // Separate useEffect for auto-completion to ensure onSkip is properly captured
  useEffect(() => {
    const autoCompleteTimer = setTimeout(() => {
      console.log("🚀 Launch sequence completed, transitioning to main");
      onSkip(); // This will trigger the transition to main
    }, 6000); // 6 seconds total

    return () => {
      clearTimeout(autoCompleteTimer);
    };
  }, [onSkip]);

  // Keyboard event handling
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space" || event.code === "Enter") {
        event.preventDefault();
        onSkip();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [onSkip]);

  return (
    <motion.div
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
      }}
      animate={{
        x:
          shakeIntensity > 0
            ? [
                -shakeIntensity,
                shakeIntensity,
                -shakeIntensity,
                shakeIntensity,
                0,
              ]
            : 0,
        y:
          shakeIntensity > 0
            ? [
                -shakeIntensity / 2,
                shakeIntensity / 2,
                -shakeIntensity / 2,
                shakeIntensity / 2,
                0,
              ]
            : 0,
      }}
      transition={{
        duration: 0.1,
        repeat: shakeIntensity > 0 ? Infinity : 0,
        repeatType: "mirror",
      }}
    >
      {/* Enhanced Stars Background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(2px 2px at 20px 30px, #eee, transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 90px 40px, #fff, transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
            radial-gradient(2px 2px at 160px 30px, #fff, transparent),
            radial-gradient(1px 1px at 200px 90px, rgba(255,255,255,0.7), transparent),
            radial-gradient(2px 2px at 240px 50px, #eee, transparent),
            radial-gradient(1px 1px at 280px 20px, #fff, transparent),
            radial-gradient(1px 1px at 320px 100px, rgba(255,255,255,0.8), transparent),
            radial-gradient(2px 2px at 360px 60px, #fff, transparent),
            radial-gradient(3px 3px at 500px 150px, rgba(251, 146, 60, 0.4), transparent),
            radial-gradient(1px 1px at 600px 250px, rgba(59, 130, 246, 0.6), transparent),
            radial-gradient(2px 2px at 700px 80px, rgba(147, 51, 234, 0.5), transparent),
            black
          `,
          backgroundSize: "800px 400px",
          animation: "twinkle 4s ease-in-out infinite alternate",
        }}
      />

      {/* Nebula Effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 800px 400px at 20% 30%, rgba(251, 146, 60, 0.1), transparent),
            radial-gradient(ellipse 600px 300px at 80% 70%, rgba(59, 130, 246, 0.08), transparent),
            radial-gradient(ellipse 400px 200px at 50% 20%, rgba(147, 51, 234, 0.06), transparent)
          `,
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

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

      {/* Audio Indicator */}
      {audioActive && (
        <motion.div
          className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-orange-500/20 text-orange-400 rounded-full backdrop-blur-sm border border-orange-400/30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-2 h-2 bg-orange-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <span className="text-sm font-mono">Audio Active</span>
        </motion.div>
      )}

      {/* Stars Background */}
      <div className="absolute inset-0 z-10">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Countdown */}
      <AnimatePresence>
        {phase === "countdown" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              className="text-center p-8 rounded-2xl"
              style={{
                background: "rgba(0, 0, 0, 0.9)",
                border: "2px solid rgba(251, 146, 60, 0.3)",
              }}
            >
              <motion.div
                className="font-mono text-6xl md:text-8xl text-orange-400 mb-4 font-bold"
                key={countdown}
                initial={{ scale: 0.5, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1.5, opacity: 0, y: -50 }}
                transition={{
                  duration: 0.4,
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                style={{
                  textShadow:
                    "0 0 20px rgba(251, 146, 60, 0.8), 0 0 40px rgba(251, 146, 60, 0.4), 0 0 60px rgba(251, 146, 60, 0.2)",
                  filter: "drop-shadow(0 0 10px rgba(251, 146, 60, 0.6))",
                }}
              >
                {countdown > 0 ? `T-${countdown}` : "🚀 IGNITION!"}
              </motion.div>
              <motion.div
                className="font-mono text-white/80 text-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {countdown > 0
                  ? "Systems check in progress..."
                  : "Main engines igniting..."}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ignition Phase */}
      <AnimatePresence>
        {phase === "ignition" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative"
              initial={{ y: 0, scale: 1 }}
              animate={{
                y: [0, -5, 0, -3, 0],
                scale: [1, 1.02, 1, 1.01, 1],
              }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              {/* Rocket Body */}
              <div className="w-8 h-24 bg-gradient-to-b from-gray-200 to-gray-600 rounded-t-full relative shadow-2xl border border-gray-400">
                {/* Rocket Tip */}
                <div className="w-4 h-8 bg-gradient-to-b from-red-400 to-red-600 rounded-full absolute -top-4 left-1/2 transform -translate-x-1/2 shadow-lg"></div>

                {/* Rocket Windows */}
                <div className="w-2 h-2 bg-blue-400 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2"></div>

                {/* Pre-launch Exhaust */}
                <motion.div
                  className="absolute top-full left-1/2 transform -translate-x-1/2 w-6 bg-gradient-to-b from-orange-400 via-red-500 to-transparent rounded-b-full"
                  style={{
                    height: "40px",
                    filter: "drop-shadow(0 0 15px rgba(251, 146, 60, 0.6))",
                  }}
                  animate={{
                    height: ["30px", "50px", "35px", "45px"],
                    opacity: [0.6, 1, 0.7, 0.9],
                    scale: [0.8, 1.2, 0.9, 1.1],
                  }}
                  transition={{
                    duration: 0.15,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                />
              </div>
            </motion.div>

            {/* Ignition Text */}
            <motion.div
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="font-mono text-orange-400 text-2xl font-bold mb-2"
                animate={{
                  textShadow: [
                    "0 0 10px rgba(251, 146, 60, 0.5)",
                    "0 0 20px rgba(251, 146, 60, 0.8)",
                    "0 0 15px rgba(251, 146, 60, 0.6)",
                  ],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                🔥 ENGINE IGNITION
              </motion.div>
              <div className="font-mono text-white/60 text-lg">
                Building thrust pressure...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rocket Launch */}
      <AnimatePresence>
        {phase === "launch" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              x: [0, -2, 2, -1, 1, 0],
              y: [0, -1, 1, -2, 2, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
              x: { duration: 0.1, repeat: Infinity, repeatType: "reverse" },
              y: { duration: 0.15, repeat: Infinity, repeatType: "reverse" },
            }}
          >
            <motion.div
              className="relative"
              initial={{ y: 200, scale: 1.5, opacity: 0 }}
              animate={{
                y: [-50, -200, -500, -1200],
                scale: [1.5, 1.2, 0.8, 0.3],
                opacity: [0, 1, 1, 0.3],
              }}
              transition={{
                duration: 3.5,
                ease: [0.25, 0.1, 0.25, 1], // Custom easing for realistic acceleration
                times: [0, 0.2, 0.6, 1],
              }}
            >
              {/* Rocket Body */}
              <div className="w-8 h-24 bg-gradient-to-b from-gray-200 to-gray-600 rounded-t-full relative shadow-2xl border border-gray-400">
                {/* Rocket Tip */}
                <div className="w-4 h-8 bg-gradient-to-b from-red-400 to-red-600 rounded-full absolute -top-4 left-1/2 transform -translate-x-1/2 shadow-lg"></div>

                {/* Rocket Windows */}
                <div className="w-2 h-2 bg-blue-400 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2"></div>

                {/* Main Exhaust Trail */}
                <motion.div
                  className="absolute top-full left-1/2 transform -translate-x-1/2 w-16 bg-gradient-to-b from-white via-orange-300 via-red-400 to-transparent rounded-b-full shadow-2xl"
                  style={{
                    filter:
                      "drop-shadow(0 0 25px rgba(251, 146, 60, 0.9)) blur(1px)",
                  }}
                  animate={{
                    height: ["150px", "300px", "400px", "500px"],
                    width: ["16px", "20px", "24px", "28px"],
                    opacity: [0.9, 1, 0.95, 0.8],
                    scale: [1, 1.1, 1.3, 1.5],
                  }}
                  transition={{
                    duration: 0.12,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />

                {/* Secondary Exhaust Plumes */}
                <motion.div
                  className="absolute top-full left-1/2 transform -translate-x-1/2 w-10 bg-gradient-to-b from-yellow-200 via-orange-400 to-transparent rounded-b-full"
                  style={{
                    height: "100px",
                    filter: "drop-shadow(0 0 15px rgba(255, 165, 0, 0.7))",
                  }}
                  animate={{
                    height: ["80px", "120px", "100px"],
                    opacity: [0.7, 1, 0.8],
                    scaleX: [0.8, 1.2, 1],
                  }}
                  transition={{
                    duration: 0.08,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 0.05,
                  }}
                />

                {/* Side Booster Flames */}
                <motion.div
                  className="absolute top-full left-1 w-3 h-12 bg-gradient-to-b from-yellow-300 via-orange-500 to-transparent rounded-b-full"
                  animate={{
                    height: ["8px", "16px", "12px"],
                    opacity: [0.6, 1, 0.7],
                    scaleY: [0.8, 1.4, 1],
                  }}
                  transition={{
                    duration: 0.1,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
                <motion.div
                  className="absolute top-full right-1 w-3 h-12 bg-gradient-to-b from-yellow-300 via-orange-500 to-transparent rounded-b-full"
                  animate={{
                    height: ["8px", "16px", "12px"],
                    opacity: [0.6, 1, 0.7],
                    scaleY: [0.8, 1.4, 1],
                  }}
                  transition={{
                    duration: 0.1,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 0.05,
                  }}
                />

                {/* Particle Effects */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute bg-orange-400 rounded-full"
                    style={{
                      width: "2px",
                      height: "2px",
                      left: `${45 + Math.random() * 10}%`,
                      top: "100%",
                    }}
                    animate={{
                      y: [0, 50 + Math.random() * 100],
                      opacity: [1, 0],
                      scale: [1, 0.3],
                    }}
                    transition={{
                      duration: 0.3 + Math.random() * 0.4,
                      repeat: Infinity,
                      delay: Math.random() * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Launch Text */}
            <motion.div
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="font-mono text-orange-400 text-2xl font-bold mb-2"
                animate={{
                  scale: [1, 1.05, 1],
                  textShadow: [
                    "0 0 15px rgba(251, 146, 60, 0.6)",
                    "0 0 25px rgba(251, 146, 60, 0.9)",
                    "0 0 20px rgba(251, 146, 60, 0.7)",
                  ],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                🚀 MAXIMUM THRUST!
              </motion.div>
              <div className="font-mono text-white/60 text-lg">
                Escaping Earth's gravity well...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Warp Speed Effect */}
      <AnimatePresence>
        {phase === "travel" && (
          <motion.div
            className="absolute inset-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Warp Lines - Multiple layers for depth */}
            {[...Array(120)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute h-px ${
                  i % 3 === 0
                    ? "bg-gradient-to-r from-transparent via-orange-400 to-transparent"
                    : i % 3 === 1
                    ? "bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                    : "bg-gradient-to-r from-transparent via-white to-transparent"
                }`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transformOrigin: "left center",
                }}
                initial={{ width: "0px", opacity: 0 }}
                animate={{
                  width: ["0px", `${200 + Math.random() * 400}px`, "0px"],
                  opacity: [0, 0.8 + Math.random() * 0.2, 0],
                  x: [0, windowWidth * (1.2 + Math.random() * 0.6)],
                }}
                transition={{
                  duration: 0.8 + Math.random() * 0.8,
                  delay: Math.random() * 1.2,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatDelay: Math.random() * 1.5,
                }}
              />
            ))}

            {/* Central Warp Tunnel */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute border border-white/20 rounded-full"
                  style={{
                    width: `${(i + 1) * 100}px`,
                    height: `${(i + 1) * 100}px`,
                  }}
                  animate={{
                    scale: [1, 3, 5],
                    opacity: [0.8, 0.3, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    ease: "easeOut",
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />
              ))}
            </motion.div>

            {/* Particle Stream */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute bg-white rounded-full"
                style={{
                  width: "2px",
                  height: "2px",
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, windowWidth * 2],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1 + Math.random() * 0.5,
                  delay: Math.random() * 2,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatDelay: Math.random() * 1,
                }}
              />
            ))}

            {/* Warp Text */}
            <motion.div
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className="font-mono text-orange-400 text-2xl font-bold mb-2"
                animate={{
                  textShadow: [
                    "0 0 10px rgba(251, 146, 60, 0.5)",
                    "0 0 20px rgba(251, 146, 60, 0.8)",
                    "0 0 15px rgba(251, 146, 60, 0.6)",
                  ],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                ⚡ HYPERSPACE JUMP
              </motion.div>
              <div className="font-mono text-white/60 text-lg">
                Approaching black hole vicinity...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LaunchSequence;
