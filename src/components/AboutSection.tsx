import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Code2, Rocket, Globe, Database, Network } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useDeviceDetection } from "../hooks/useDeviceDetection";

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
    "C",
    "Java",
    "Python",
    "Dart",
    "JavaScript",
    "Flutter",
    "TensorFlow",
    "Git",
  ];

  return (
    <section
      id="about"
      data-section="about"
      className="min-h-screen py-20 relative overflow-hidden about-section"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full animate-pulse" />
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-orange-300 rounded-full animate-pulse" />
      </div>

      <div ref={ref} className="max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2
            className={`text-4xl md:text-6xl font-display font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            } mb-4 text-shadow-soft`}
          >
            About <span className="interstellar-text">Developer</span>
          </h2>
          <p
            className={`text-xl ${
              isDarkMode ? "text-white/70" : "text-gray-700"
            } max-w-3xl mx-auto`}
          >
            Personal Profile: Full Stack Developer & Problem Solver
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Personal Planet Visualization */}
          <motion.div
            className={`relative ${
              deviceInfo.isMobile ? "h-80" : "h-96"
            } flex items-center justify-center overflow-hidden`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* Central Planet */}
            <div className="relative w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-2xl">
              <div className="absolute inset-2 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full" />
              <div className="absolute inset-4 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
            </div>

            {/* Orbiting Satellites (Skills) */}
            {orbitingSkills.map((skill, index) => {
              const baseRadius = deviceInfo.isMobile ? 60 : 80; // Smaller radius on mobile
              const radiusIncrement = deviceInfo.isMobile ? 8 : 10; // Smaller increments on mobile
              const radius = baseRadius + index * radiusIncrement;

              return (
                <motion.div
                  key={skill}
                  className="absolute inset-0 flex items-center justify-center"
                  animate={
                    deviceInfo.prefersReducedMotion
                      ? {}
                      : {
                          rotate: 360,
                        }
                  }
                  transition={{
                    duration: deviceInfo.isMobile
                      ? 15 + index * 3
                      : 10 + index * 2, // Slower on mobile for better performance
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div
                    className="absolute w-6 h-6 bg-white/80 rounded-full flex items-center justify-center text-xs font-mono font-bold text-black"
                    style={{
                      transform: `translateX(${radius}px)`,
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white text-xs font-mono whitespace-nowrap">
                      {skill}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Orbital Paths */}
            {[...Array(3)].map((_, i) => {
              const baseSize = deviceInfo.isMobile ? 240 : 320; // Much smaller on mobile to fit
              const increment = deviceInfo.isMobile ? 24 : 40; // Smaller increments on mobile
              const size = baseSize + i * increment;

              return (
                <div
                  key={i}
                  className="absolute rounded-full border border-white/10"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              );
            })}
          </motion.div>

          {/* About Content */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="glass-morphism-dark noise-texture rounded-xl p-6 shadow-glow-lg">
              <h3 className="text-2xl font-mono text-orange-400 mb-4 glow-accretion">
                Developer Profile
              </h3>
              <p
                className={`${
                  isDarkMode ? "text-white/80" : "text-gray-700"
                } leading-relaxed mb-4`}
              >
                I’m a Computer Science Engineering student at Sreenidhi
                Institute of Science and Technology (SNIST) with a strong
                command of Data Structures and Algorithms (DSA)—the core of my
                problem-solving mindset. Proficient in C, Java, Python, Dart,
                and JavaScript, I specialize in full-stack web development,
                Flutter-based mobile apps, and machine learning. With 500+
                problems solved on LeetCode and consistent participation in
                coding contests, I’m deeply invested in algorithmic thinking and
                performance optimization.
              </p>
              <p
                className={`${
                  isDarkMode ? "text-white/80" : "text-gray-700"
                } leading-relaxed`}
              >
                Currently maintaining a CGPA of 8.1, I’ve worked on impactful
                projects like a Taxi Fare Predictor using Random Forests, an
                interactive LRU Cache simulator, an AI-powered farming assistant
                (FarmSmartAI), and a Contact Manager featuring efficient search
                using Trie (prefix tree) for real-time auto-completion and
                querying. As an active member of the National Cadet Corps (NCC),
                I’ve developed leadership, discipline, and a team-first attitude
                that I bring into both technical and collaborative settings. I’m
                driven by curiosity, continuous learning, and a passion for
                building tech that matters.
              </p>
            </div>

            {/* Skill Levels */}
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  className="glass-morphism rounded-xl p-4 event-horizon-hover"
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <skill.icon className="text-orange-400" size={20} />
                      <span
                        className={`font-mono ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {skill.name}
                      </span>
                    </div>
                    <span className="font-mono text-orange-400 text-sm">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      className="h-2 bg-gradient-to-r from-orange-400 to-orange-300 rounded-full"
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
    </section>
  );
};

export default AboutSection;
