import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Code2, Rocket, Globe, Database, Network } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useDeviceDetection } from "../hooks/useDeviceDetection";
import { AboutBackground } from "./SectionBackgrounds";

const AboutSection: React.FC = () => {
  const { isDarkMode } = useTheme();
  const deviceInfo = useDeviceDetection();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const skills = [
    { name: "Programming Languages", icon: Code2, level: 90 },
    { name: "Data structures & Algorithms", icon: Network, level: 85 },
    { name: "Machine Learning", icon: Database, level: 85 },
    { name: "Full Stack Development", icon: Globe, level: 88 },
    { name: "Mobile Development", icon: Rocket, level: 75 },
  ];

  const orbitingSkills = [
    { name: "C", color: "#A8B9CC", size: "large" },
    { name: "Java", color: "#ED8B00", size: "medium" },
    { name: "Python", color: "#3776AB", size: "large" },
    { name: "Dart", color: "#0175C2", size: "small" },
    { name: "JavaScript", color: "#F7DF1E", size: "large" },
    { name: "Flutter", color: "#02569B", size: "medium" },
    { name: "TensorFlow", color: "#FF6F00", size: "medium" },
    { name: "Git", color: "#F05032", size: "small" },
    { name: "React", color: "#61DAFB", size: "medium" },
    { name: "Node.js", color: "#339933", size: "small" },
  ];

  return (
    <section
      id="about"
      data-section="about"
      className={`min-h-screen py-20 relative ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}
    >
      <AboutBackground />

      {/* Additional floating elements */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/40 rounded-full"
            style={{
              left: `${20 + i * 12}%`,
              top: `${30 + i * 8}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div ref={ref} className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2
              className={`text-4xl md:text-6xl font-display font-bold mb-4 text-shadow-soft ${
                isDarkMode
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              About <span className="interstellar-text">Developer</span>
            </h2>
            <p
              className={`text-xl max-w-3xl mx-auto ${
                isDarkMode ? "text-white/70" : "text-gray-600"
              }`}
            >
              Personal Profile: Full Stack Developer & Problem Solver
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Enhanced Solar System Visualization */}
            <motion.div
              className={`relative w-full ${deviceInfo.isMobile ? "min-h-[400px] h-[400px]" : "min-h-[700px] h-[700px]"} flex items-center justify-center`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
            >
              {/* Central Star (Developer Core) */}
              <motion.div
                className="relative w-32 h-32 rounded-full shadow-2xl"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(255, 165, 0, 0.5)",
                    "0 0 40px rgba(255, 165, 0, 0.8)",
                    "0 0 20px rgba(255, 165, 0, 0.5)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #FFD700, #FF8C00, #FF4500)",
                }}
              >
                <motion.div
                  className="absolute inset-2 rounded-full overflow-hidden"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    background:
                      "radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.3), transparent 60%)",
                  }}
                >
                  {/* Solar Surface Patterns */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "linear-gradient(30deg, transparent 20%, rgba(255, 255, 255, 0.1) 40%, transparent 60%)",
                    }}
                  />
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "linear-gradient(-60deg, transparent 30%, rgba(255, 200, 0, 0.2) 50%, transparent 70%)",
                    }}
                  />
                </motion.div>
                <div className="absolute inset-4 bg-gradient-to-br from-white/20 to-transparent rounded-full" />

                {/* Core Label */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={isDarkMode ? "text-xs font-bold text-white drop-shadow-lg" : "text-xs font-bold text-gray-900 drop-shadow-lg"}>
                    DEV
                  </span>
                </div>
              </motion.div>

              {/* Orbiting Planets (Skills) */}
              {orbitingSkills.map((skill, index) => {
                const baseRadius = deviceInfo.isMobile ? 70 : 90;
                const radiusIncrement = deviceInfo.isMobile ? 12 : 15;
                const radius = baseRadius + index * radiusIncrement;
                const orbitSpeed = deviceInfo.isMobile
                  ? 20 + index * 4 // Slower, smoother motion
                  : 15 + index * 3;
                const planetSize =
                  skill.size === "large" ? 10 : skill.size === "medium" ? 8 : 6;

                return (
                  <motion.div
                    key={skill.name}
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                      rotate: 360, // Orbital motion around the star
                    }}
                    transition={{
                      duration: orbitSpeed,
                      repeat: Infinity,
                      ease: "linear",
                      repeatType: "loop",
                    }}
                  >
                    <motion.div
                      className="absolute rounded-full shadow-lg"
                      style={{
                        width: `${planetSize + 4}px`,
                        height: `${planetSize + 4}px`,
                        backgroundColor: skill.color,
                        boxShadow: `0 0 ${planetSize}px ${skill.color}40`,
                      }}
                      animate={{
                        x: radius, // Position planet at radius from center
                        scale: [1, 1.1, 1], // Gentle pulsing
                        boxShadow: [
                          `0 0 ${planetSize}px ${skill.color}40`,
                          `0 0 ${planetSize * 1.5}px ${skill.color}60`,
                          `0 0 ${planetSize}px ${skill.color}40`,
                        ],
                      }}
                      transition={{
                        x: { duration: 0 }, // Instant positioning
                        scale: {
                          duration: 3 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        },
                        boxShadow: {
                          duration: 3 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        },
                      }}
                      whileHover={{
                        scale: 1.5,
                        boxShadow: `0 0 ${planetSize * 3}px ${skill.color}80`,
                      }}
                    >
                      {/* Planet Core - Static Surface */}
                      <div
                        className="absolute inset-1 rounded-full"
                        style={{
                          background: `radial-gradient(circle at 30% 30%, ${skill.color}CC, ${skill.color}80)`,
                        }}
                      >
                        {/* Static Surface Pattern */}
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: `linear-gradient(45deg, transparent 30%, ${skill.color}40 50%, transparent 70%)`,
                          }}
                        />
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: `linear-gradient(-45deg, transparent 40%, ${skill.color}20 60%, transparent 80%)`,
                          }}
                        />
                      </div>

                      {/* Skill Label - Always Visible */}
                      <motion.div
                        className={`absolute -top-12 left-1/2 transform -translate-x-1/2 text-xs font-mono font-bold whitespace-nowrap px-3 py-1.5 rounded-lg backdrop-blur-sm border shadow-lg ${isDarkMode ? 'text-white bg-black/90' : 'text-gray-900 bg-white/90 border-orange-200'}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        whileHover={{ scale: 1.1, y: -2 }}
                        style={{
                          color: skill.color,
                          borderColor: `${skill.color}60`,
                          textShadow: `0 0 8px ${skill.color}`,
                          boxShadow: `0 0 10px ${skill.color}40, 0 4px 8px rgba(0,0,0,0.3)`,
                        }}
                      >
                        {skill.name}
                      </motion.div>
                    </motion.div>
                  </motion.div>
                );
              })}

              {/* Enhanced Orbital Paths with Motion Indicators */}
              {[...Array(5)].map((_, i) => {
                const baseSize = deviceInfo.isMobile ? 220 : 300;
                const increment = deviceInfo.isMobile ? 24 : 30;
                const size = baseSize + i * increment;

                return (
                  <div key={i}>
                    <motion.div
                      className="absolute rounded-full border border-orange-400/30"
                      style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                      animate={{
                        borderColor: [
                          "rgba(255, 165, 0, 0.2)",
                          "rgba(255, 165, 0, 0.5)",
                          "rgba(255, 165, 0, 0.2)",
                        ],
                      }}
                      transition={{
                        duration: 4 + i * 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                    />
                    {/* Orbital Direction Indicator */}
                    <motion.div
                      className="absolute w-2 h-2 bg-orange-400 rounded-full"
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                      animate={{
                        rotate: 360,
                        x: size / 2,
                        y: 0,
                      }}
                      transition={{
                        duration: 8 + i * 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </div>
                );
              })}

              {/* Asteroid Belt Effect */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`asteroid-${i}`}
                  className="absolute w-1 h-1 bg-gray-400 rounded-full"
                  style={{
                    left: "50%",
                    top: "50%",
                  }}
                  animate={{
                    rotate: 360,
                    x:
                      Math.cos((i * 30 * Math.PI) / 180) *
                      (deviceInfo.isMobile ? 140 : 180),
                    y:
                      Math.sin((i * 30 * Math.PI) / 180) *
                      (deviceInfo.isMobile ? 140 : 180),
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                    opacity: { duration: 3, repeat: Infinity, delay: i * 0.2 },
                  }}
                />
              ))}

              {/* Shooting Stars/Comets */}
              {!deviceInfo.isMobile &&
                [...Array(3)].map((_, i) => (
                  <motion.div
                    key={`comet-${i}`}
                    className="absolute w-1 h-1 bg-orange-300 rounded-full"
                    style={{
                      left: "10%",
                      top: "10%",
                      boxShadow:
                        "0 0 6px rgba(255, 165, 0, 0.8), 0 0 12px rgba(255, 165, 0, 0.4)",
                    }}
                    animate={{
                      x: [0, 300, 0],
                      y: [0, 200, 0],
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                    }}
                    transition={{
                      duration: 4 + i * 2,
                      repeat: Infinity,
                      delay: i * 3,
                      ease: "easeInOut",
                    }}
                  />
                ))}

              {/* Pulsing Energy Rings */}
              {[...Array(2)].map((_, i) => (
                <motion.div
                  key={`energy-ring-${i}`}
                  className="absolute rounded-full border border-orange-400/30"
                  style={{
                    width: `${200 + i * 100}px`,
                    height: `${200 + i * 100}px`,
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                    borderColor: [
                      "rgba(255, 165, 0, 0.3)",
                      "rgba(255, 165, 0, 0.6)",
                      "rgba(255, 165, 0, 0.3)",
                    ],
                  }}
                  transition={{
                    duration: 6 + i * 2,
                    repeat: Infinity,
                    delay: i * 1.5,
                  }}
                />
              ))}
            </motion.div>

            {/* About Content */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.div
                className={`glass-morphism-dark noise-texture rounded-xl p-6 shadow-glow-lg ${
                  isDarkMode
                    ? ""
                    : "bg-white/80 border border-orange-200 shadow-glow-md"
                }`}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <motion.h3
                  className={`text-2xl font-mono mb-6 glow-accretion ${
                    isDarkMode ? "text-orange-400" : "text-amber-600"
                  }`}
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(255, 165, 0, 0.5)",
                      "0 0 20px rgba(255, 165, 0, 0.8)",
                      "0 0 10px rgba(255, 165, 0, 0.5)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  🚀 Developer Profile
                </motion.h3>
                <p
                  className={`leading-relaxed mb-4 ${
                    isDarkMode ? "text-white/80" : "text-gray-700"
                  }`}
                >
                  I'm a Computer Science Engineering student at Sreenidhi
                  Institute of Science and Technology (SNIST) with a strong
                  command of Data Structures and Algorithms (DSA)—the core of my
                  problem-solving mindset. Proficient in C, Java, Python, Dart,
                  and JavaScript, I specialize in full-stack web development,
                  Flutter-based mobile apps, and machine learning. With 500+
                  problems solved on LeetCode and consistent participation in
                  coding contests, I'm deeply invested in algorithmic thinking
                  and performance optimization.
                </p>
                <p
                  className={`leading-relaxed ${
                    isDarkMode ? "text-white/80" : "text-gray-700"
                  }`}
                >
                  Currently maintaining a CGPA of 8.1, I've worked on impactful
                  projects like a Taxi Fare Predictor using Random Forests, an
                  interactive LRU Cache simulator, an AI-powered farming
                  assistant (FarmSmartAI), and a Contact Manager featuring
                  efficient search using Trie (prefix tree) for real-time
                  auto-completion and querying. As an active member of the
                  National Cadet Corps (NCC), I've developed leadership,
                  discipline, and a team-first attitude that I bring into both
                  technical and collaborative settings. I'm driven by curiosity,
                  continuous learning, and a passion for building tech that
                  matters.
                </p>
              </motion.div>

              {/* Skill Levels */}
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    className={`glass-morphism rounded-xl p-4 event-horizon-hover ${
                      isDarkMode
                        ? ""
                        : "bg-white/90 border border-orange-100 shadow-glow-md"
                    }`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <skill.icon className={isDarkMode ? "text-orange-400" : "text-amber-600"} size={20} />
                        <span
                          className={`font-mono ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {skill.name}
                        </span>
                      </div>
                      <span className={isDarkMode ? "font-mono text-orange-400 text-sm" : "font-mono text-amber-600 text-sm"}>
                        {skill.level}%
                      </span>
                    </div>
                    <div className={isDarkMode ? "w-full bg-white/10 rounded-full h-2" : "w-full bg-orange-100 rounded-full h-2"}>
                      <motion.div
                        className={isDarkMode ? "h-2 bg-gradient-to-r from-orange-400 to-orange-300 rounded-full" : "h-2 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"}
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${skill.level}%` } : {}}
                        transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
