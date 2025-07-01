import React from "react";
import { motion } from "framer-motion";
import { useDeviceDetection } from "../hooks/useDeviceDetection";
import { useTheme } from "../contexts/ThemeContext";
import { Code2, Rocket, Star, Award, Mail, Zap } from "lucide-react";

interface BackgroundProps {
  className?: string;
}

// About Section Background
export const AboutBackground: React.FC<BackgroundProps> = ({
  className = "",
}) => {
  const deviceInfo = useDeviceDetection();
  const { isDarkMode } = useTheme();
  const shouldAnimate = !deviceInfo.prefersReducedMotion; // Enable on all devices

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-black" />
      {/* Animated Code Symbols */}
      {shouldAnimate && (
        <>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-orange-400/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                rotate: [0, 180, 360],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            >
              <Code2 size={16 + Math.random() * 8} />
            </motion.div>
          ))}

          {/* Floating Tech Icons */}
          {["JS", "PY", "C", "JAVA", "DART"].map((tech, i) => (
            <motion.div
              key={tech}
              className="absolute text-xs font-mono text-white/10 font-bold"
              style={{
                left: `${15 + i * 18}%`,
                top: `${20 + Math.sin(i) * 30}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              {tech}
            </motion.div>
          ))}

          {/* Binary Rain Effect */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-orange-400/10 font-mono text-xs"
                style={{
                  left: `${10 + i * 15}%`,
                  top: "-10%",
                }}
                animate={{
                  y: ["0vh", "110vh"],
                }}
                transition={{
                  duration: 15 + Math.random() * 10,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "linear",
                }}
              >
                {Array.from({ length: 20 }, () =>
                  Math.random() > 0.5 ? "1" : "0"
                ).join("")}
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Enhanced static elements - always visible */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-orange-400/60 rounded-full animate-pulse shadow-lg shadow-orange-400/50" />
      <div
        className={`absolute top-40 right-20 w-2 h-2 rounded-full animate-pulse shadow-lg ${
          isDarkMode
            ? "bg-white/60 shadow-white/50"
            : "bg-gray-800/60 shadow-gray-800/50"
        }`}
      />
      <div className="absolute bottom-20 left-1/4 w-2.5 h-2.5 bg-orange-300/60 rounded-full animate-pulse shadow-lg shadow-orange-300/50" />

      {/* Additional always-visible effects */}
      <div className="absolute inset-0 bg-black" />

      {/* Floating code symbols - always visible */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute text-orange-400/30 font-mono text-lg animate-pulse"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + Math.sin(i) * 30}%`,
            animationDelay: `${i * 0.5}s`,
          }}
        >
          {["</>", "{}", "[]", "()", "&&", "||", "=>", "++"][i]}
        </div>
      ))}
    </div>
  );
};

// Projects Section Background
export const ProjectsBackground: React.FC<BackgroundProps> = ({
  className = "",
}) => {
  const deviceInfo = useDeviceDetection();
  const { isDarkMode } = useTheme();
  const shouldAnimate = !deviceInfo.prefersReducedMotion; // Enable on all devices

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Base space gradient background */}
      <div className="absolute inset-0 bg-black" />

      {/* Enhanced Star Field - Always visible */}
      {[...Array(100)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full shadow-lg ${
            isDarkMode
              ? "bg-white shadow-white/50"
              : "bg-gray-800 shadow-gray-800/50"
          }`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
          }}
          animate={
            shouldAnimate
              ? {
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                  y: [-5, 5, -5],
                }
              : {
                  opacity: [0.2, 0.6, 0.2],
                }
          }
          transition={{
            duration: Math.random() * 6 + 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* Rocket Trail Effect for Mobile */}
      {shouldAnimate && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
              }}
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                rotate: [0, 45, 0],
              }}
              transition={{
                duration: 12 + i * 2,
                repeat: Infinity,
                delay: i * 4,
              }}
            >
              <Rocket className="text-orange-400/20" size={20} />
            </motion.div>
          ))}

          {/* Constellation Lines */}
          <svg className="absolute inset-0 w-full h-full">
            {[...Array(8)].map((_, i) => (
              <motion.line
                key={i}
                x1={`${Math.random() * 100}%`}
                y1={`${Math.random() * 100}%`}
                x2={`${Math.random() * 100}%`}
                y2={`${Math.random() * 100}%`}
                stroke="rgba(251, 146, 60, 0.3)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{
                  duration: 3,
                  delay: i * 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            ))}
          </svg>
        </>
      )}
    </div>
  );
};

// Achievements Section Background
export const AchievementsBackground: React.FC<BackgroundProps> = ({
  className = "",
}) => {
  const deviceInfo = useDeviceDetection();
  const { isDarkMode } = useTheme();
  const shouldAnimate = !deviceInfo.prefersReducedMotion; // Enable on all devices

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Achievement Stars */}
      {[...Array(shouldAnimate ? 25 : 15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={
            shouldAnimate
              ? {
                  rotate: 360,
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.6, 0.2],
                  y: [-10, 10, -10],
                }
              : {
                  rotate: 360,
                  opacity: [0.2, 0.4, 0.2],
                }
          }
          transition={{
            duration: Math.random() * 8 + 6,
            repeat: Infinity,
            delay: Math.random() * 4,
          }}
        >
          <Star className="text-orange-400/30" size={Math.random() * 12 + 8} />
        </motion.div>
      ))}

      {/* Trophy and Award Icons for Mobile */}
      {shouldAnimate && (
        <>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${25 + i * 20}%`,
                top: `${20 + Math.sin(i) * 40}%`,
              }}
              animate={{
                y: [-15, 15, -15],
                rotate: [-5, 5, -5],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 7 + i,
                repeat: Infinity,
                delay: i * 1.5,
              }}
            >
              <Award className="text-orange-400/20" size={24} />
            </motion.div>
          ))}

          {/* Celebration Particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-orange-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                y: [-20, 20],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

// Contact Section Background
export const ContactBackground: React.FC<BackgroundProps> = ({
  className = "",
}) => {
  const deviceInfo = useDeviceDetection();
  const { isDarkMode } = useTheme();
  const shouldAnimate = !deviceInfo.prefersReducedMotion; // Enable on all devices

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Signal Waves */}
      {[...Array(shouldAnimate ? 6 : 3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <motion.div
            className={`w-${96 + i * 32} h-${
              96 + i * 32
            } border border-orange-400/20 rounded-full`}
            animate={
              shouldAnimate
                ? {
                    scale: [1, 1.8, 1],
                    opacity: [0.5, 0, 0.5],
                  }
                : {
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0, 0.3],
                  }
            }
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 0.8,
            }}
          />
        </motion.div>
      ))}

      {/* Communication Icons for Mobile */}
      {shouldAnimate && (
        <>
          {[Mail, Zap].map((Icon, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${30 + i * 40}%`,
                top: `${25 + i * 30}%`,
              }}
              animate={{
                y: [-12, 12, -12],
                opacity: [0.2, 0.5, 0.2],
                rotate: [-10, 10, -10],
              }}
              transition={{
                duration: 6 + i * 2,
                repeat: Infinity,
                delay: i * 2,
              }}
            >
              <Icon className="text-orange-400/25" size={28} />
            </motion.div>
          ))}

          {/* Data Stream Effect */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-8 bg-gradient-to-b from-orange-400/30 to-transparent"
              style={{
                left: `${15 + i * 10}%`,
                top: "10%",
              }}
              animate={{
                y: [0, 400],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "linear",
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

// Hobbies Section Background
export const HobbiesBackground: React.FC<BackgroundProps> = ({
  className = "",
}) => {
  const deviceInfo = useDeviceDetection();
  const shouldAnimate = !deviceInfo.prefersReducedMotion; // Enable on all devices

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Hobby-themed floating icons */}
      {shouldAnimate && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${20 + i * 15}%`,
                top: `${25 + Math.sin(i) * 25}%`,
              }}
              animate={{
                y: [-15, 15, -15],
                rotate: [-10, 10, -10],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 1.5,
              }}
            >
              <div className="text-purple-400/20 text-2xl">
                {["🎸", "🏏", "♔", "✈️", "🎵", "🏆"][i]}
              </div>
            </motion.div>
          ))}

          {/* Musical notes floating effect */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-purple-400/15 font-bold text-xl"
              style={{
                left: `${10 + i * 12}%`,
                top: `${40 + Math.sin(i * 0.5) * 20}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.1, 0.3, 0.1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 6 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              ♪
            </motion.div>
          ))}
        </>
      )}

      {/* Static elements for desktop */}
      <div className="absolute top-10 left-20 w-1 h-1 bg-purple-400/30 rounded-full" />
      <div className="absolute top-32 right-16 w-2 h-2 bg-green-400/30 rounded-full" />
      <div className="absolute bottom-16 left-1/3 w-1.5 h-1.5 bg-blue-400/30 rounded-full" />
    </div>
  );
};
