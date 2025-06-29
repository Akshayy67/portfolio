import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Github, Linkedin } from "lucide-react";
import Typed from "typed.js";
import DynamicGreeting from "./DynamicGreeting";
import { useTheme } from "../contexts/ThemeContext";

const HeroSection: React.FC = () => {
  const { isDarkMode } = useTheme();
  const typedRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 1000], [0, -200]);
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const smoothParallaxY = useSpring(parallaxY, springConfig);

  // Device detection
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Mouse tracking for 3D effects (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x: x * 20, y: y * 20 });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, [isMobile]);

  useEffect(() => {
    console.log("HeroSection mounted");
    if (typedRef.current) {
      try {
        const typed = new Typed(typedRef.current, {
          strings: [
            "const developer = new ComputerScientist();",
            'developer.skills = ["C", "Java", "Python", "Dart", "JavaScript"];',
            'developer.frameworks = ["Flutter", "TensorFlow", "React"];',
            'developer.mission = "Building innovative solutions";',
            "developer.launch();",
          ],
          typeSpeed: 50,
          backSpeed: 30,
          backDelay: 2000,
          loop: true,
          showCursor: true,
          cursorChar: "_",
        });

        return () => {
          typed.destroy();
        };
      } catch (error) {
        console.error("Typed.js error:", error);
      }
    }
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="min-h-screen relative flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Simplified Background */}
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 ${isDarkMode ? "bg-black" : "bg-white"}`}
        />

        {/* Simple Stars */}
        {isDarkMode &&
          [...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full opacity-50"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
              }}
            />
          ))}
      </div>

      {/* Content Container */}
      <div
        ref={ref}
        className={`relative z-10 text-center mx-auto px-4 sm:px-6 lg:px-8 ${
          isMobile ? "max-w-5xl py-8 sm:py-12" : "max-w-4xl"
        }`}
      >
        {/* Dynamic Greeting */}
        {isMobile ? (
          <motion.div
            className="mb-6 sm:mb-8"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <DynamicGreeting className="relative" showDetails={false} />
          </motion.div>
        ) : (
          <div className="mb-4">
            <DynamicGreeting className="relative" showDetails={false} />
          </div>
        )}

        {/* Hero Title */}
        {isMobile ? (
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{
              duration: 1.2,
              delay: 0.2,
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
            className="mb-6 sm:mb-8"
          >
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-display font-bold leading-tight"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.span
                className={`${
                  isDarkMode ? "text-white" : "text-gray-900"
                } text-shadow-soft block sm:inline-block`}
                animate={{
                  textShadow: isDarkMode
                    ? [
                        "0 0 20px rgba(255, 255, 255, 0.5)",
                        "0 0 30px rgba(255, 255, 255, 0.8)",
                        "0 0 20px rgba(255, 255, 255, 0.5)",
                      ]
                    : [
                        "0 0 10px rgba(0, 0, 0, 0.1)",
                        "0 0 15px rgba(0, 0, 0, 0.2)",
                        "0 0 10px rgba(0, 0, 0, 0.1)",
                      ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                I'm{" "}
              </motion.span>
              <motion.span
                className="interstellar-text accretion-disk block sm:inline-block"
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                Akshay Juluri
              </motion.span>
            </motion.h1>

            <motion.h2
              className={`text-xl sm:text-2xl md:text-3xl lg:text-5xl font-mono ${
                isDarkMode ? "text-white/90" : "text-gray-700"
              } mt-4 sm:mt-6 text-shadow-soft leading-relaxed`}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.span
                animate={{
                  color: isDarkMode
                    ? [
                        "rgba(255, 255, 255, 0.9)",
                        "rgba(255, 165, 0, 0.9)",
                        "rgba(255, 255, 255, 0.9)",
                      ]
                    : [
                        "rgba(55, 65, 81, 0.9)",
                        "rgba(217, 119, 6, 0.9)",
                        "rgba(55, 65, 81, 0.9)",
                      ],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                Computer Science Engineer & Full Stack Developer
              </motion.span>
            </motion.h2>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-bold mb-4 sm:mb-6 leading-tight">
              <span
                className={`${
                  isDarkMode ? "text-white" : "text-gray-900"
                } text-shadow-soft block sm:inline`}
              >
                I'm{" "}
              </span>
              <span className="interstellar-text accretion-disk block sm:inline">
                Akshay Juluri
              </span>
            </h1>
            <h2
              className={`text-lg sm:text-xl md:text-2xl lg:text-4xl font-mono ${
                isDarkMode ? "text-white/80" : "text-gray-700"
              } mb-6 sm:mb-8 text-shadow-soft px-2 sm:px-0 leading-relaxed`}
            >
              Computer Science Engineer & Full Stack Developer
            </h2>
          </motion.div>
        )}

        {/* Terminal */}
        {isMobile ? (
          <motion.div
            className="glass-morphism-dark noise-texture rounded-2xl p-6 sm:p-8 font-mono text-left max-w-3xl mx-auto mb-8 sm:mb-12 shadow-glow-lg"
            initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
            animate={inView ? { opacity: 1, scale: 1, rotateX: 0 } : {}}
            transition={{
              duration: 1,
              delay: 0.8,
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
            whileHover={{
              scale: 1.02,
              rotateX: 2,
              boxShadow: "0 25px 50px rgba(255, 165, 0, 0.2)",
            }}
          >
            <motion.div
              className="flex items-center mb-4 sm:mb-6"
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex space-x-2 sm:space-x-3">
                <motion.div
                  className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded-full"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                />
              </div>
              <motion.span
                className={`${
                  isDarkMode ? "text-white/70" : "text-gray-600"
                } text-sm sm:text-base ml-4 sm:ml-6 truncate`}
                animate={{
                  color: isDarkMode
                    ? [
                        "rgba(255, 255, 255, 0.7)",
                        "rgba(255, 165, 0, 0.9)",
                        "rgba(255, 255, 255, 0.7)",
                      ]
                    : [
                        "rgba(75, 85, 99, 0.8)",
                        "rgba(217, 119, 6, 0.9)",
                        "rgba(75, 85, 99, 0.8)",
                      ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ~/juluri-akshay-dev
              </motion.span>
            </motion.div>
            <div className="text-green-400 text-sm sm:text-base md:text-lg overflow-x-auto">
              <motion.span
                className="text-orange-400"
                animate={{
                  textShadow: [
                    "0 0 5px rgba(255, 165, 0, 0.5)",
                    "0 0 15px rgba(255, 165, 0, 0.8)",
                    "0 0 5px rgba(255, 165, 0, 0.5)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                $
              </motion.span>{" "}
              <span ref={typedRef}></span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="glass-morphism-dark noise-texture rounded-xl p-4 sm:p-6 font-mono text-left max-w-2xl mx-auto mb-6 sm:mb-8 shadow-glow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="flex space-x-1.5 sm:space-x-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
              </div>
              <span
                className={`${
                  isDarkMode ? "text-white/60" : "text-gray-600"
                } text-xs sm:text-sm ml-3 sm:ml-4 truncate`}
              >
                ~/juluri-akshay-dev
              </span>
            </div>
            <div className="text-green-400 text-xs sm:text-sm md:text-base overflow-x-auto">
              <span className="text-orange-400">$</span>{" "}
              <span ref={typedRef}></span>
            </div>
          </motion.div>
        )}

        {/* Mission Statement */}
        <motion.div
          className="mb-10 sm:mb-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <motion.p
            className={`text-lg sm:text-xl md:text-2xl ${
              isDarkMode ? "text-white/80" : "text-gray-700"
            } leading-relaxed font-body text-shadow-soft`}
            animate={{
              opacity: [0.8, 1, 0.8],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Computer Science Engineering student at{" "}
            <motion.span
              className="text-orange-400 font-semibold"
              whileHover={{ scale: 1.05 }}
            >
              SNIST
            </motion.span>{" "}
            with expertise in multiple programming languages, machine learning,
            and full-stack development. Building innovative solutions with
            modern technologies.
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <motion.a
            href="#projects"
            className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 bg-gradient-to-r from-orange-400 to-orange-500 text-black font-mono font-semibold rounded-full overflow-hidden text-center"
            whileHover={{
              scale: 1.05,
              y: -3,
              boxShadow: "0 20px 40px rgba(255, 165, 0, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(255, 165, 0, 0.3)",
                "0 0 40px rgba(255, 165, 0, 0.6)",
                "0 0 20px rgba(255, 165, 0, 0.3)",
              ],
            }}
            transition={{
              boxShadow: { duration: 2, repeat: Infinity },
              hover: { type: "spring", stiffness: 300, damping: 20 },
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-300 to-orange-400 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10">Explore Projects</span>
          </motion.a>

          <motion.a
            href="#contact"
            className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 border-2 border-orange-400/60 text-orange-400 font-mono font-semibold rounded-full overflow-hidden text-center backdrop-blur-sm"
            whileHover={{
              scale: 1.05,
              y: -3,
              borderColor: "rgba(255, 165, 0, 1)",
              backgroundColor: "rgba(255, 165, 0, 0.1)",
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              borderColor: [
                "rgba(255, 165, 0, 0.6)",
                "rgba(255, 165, 0, 0.9)",
                "rgba(255, 165, 0, 0.6)",
              ],
            }}
            transition={{
              borderColor: { duration: 2, repeat: Infinity },
              hover: { type: "spring", stiffness: 300, damping: 20 },
            }}
          >
            <motion.div
              className="absolute inset-0 bg-orange-400/10 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10">Get In Touch</span>
          </motion.a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="flex gap-6 sm:gap-8 justify-center mb-20 sm:mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.8 }}
        >
          <motion.a
            href="https://github.com/Akshayy67"
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative p-4 sm:p-5 glass-morphism-subtle rounded-full ${
              isDarkMode ? "text-white/80" : "text-gray-700"
            } overflow-hidden`}
            whileHover={{
              scale: 1.15,
              y: -5,
              rotateY: 15,
              boxShadow: "0 15px 30px rgba(255, 165, 0, 0.3)",
            }}
            whileTap={{ scale: 0.9 }}
            animate={{
              y: [0, -3, 0],
              rotateZ: [0, 5, 0, -5, 0],
            }}
            transition={{
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              rotateZ: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              hover: { type: "spring", stiffness: 300, damping: 20 },
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
            <Github
              size={24}
              className="sm:w-7 sm:h-7 relative z-10 group-hover:text-orange-400 transition-colors duration-300"
            />
          </motion.a>

          <motion.a
            href="https://www.linkedin.com/in/akshay-juluri-84813928a/"
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative p-4 sm:p-5 glass-morphism-subtle rounded-full ${
              isDarkMode ? "text-white/80" : "text-gray-700"
            } overflow-hidden`}
            whileHover={{
              scale: 1.15,
              y: -5,
              rotateY: -15,
              boxShadow: "0 15px 30px rgba(255, 165, 0, 0.3)",
            }}
            whileTap={{ scale: 0.9 }}
            animate={{
              y: [0, -3, 0],
              rotateZ: [0, -5, 0, 5, 0],
            }}
            transition={{
              y: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              },
              rotateZ: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3,
              },
              hover: { type: "spring", stiffness: 300, damping: 20 },
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
            <Linkedin
              size={24}
              className="sm:w-7 sm:h-7 relative z-10 group-hover:text-orange-400 transition-colors duration-300"
            />
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2 z-20"
        animate={{
          y: [0, 15, 0],
          rotateX: [0, 10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{
          scale: 1.2,
          rotateY: 15,
        }}
      >
        <motion.div
          className="relative w-8 h-12 sm:w-10 sm:h-14 border-2 border-orange-400/60 rounded-full p-1 backdrop-blur-sm"
          animate={{
            borderColor: [
              "rgba(255, 165, 0, 0.6)",
              "rgba(255, 165, 0, 1)",
              "rgba(255, 165, 0, 0.6)",
            ],
            boxShadow: [
              "0 0 10px rgba(255, 165, 0, 0.3)",
              "0 0 25px rgba(255, 165, 0, 0.6)",
              "0 0 10px rgba(255, 165, 0, 0.3)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-4 sm:w-2 sm:h-5 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full mx-auto"
            animate={{
              y: [0, 16, 0],
              opacity: [1, 0.3, 1],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <motion.p
          className="text-orange-400/70 text-xs sm:text-sm font-mono mt-3 text-center"
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll to explore
        </motion.p>
      </motion.div>
    </section>
  );
};

export default HeroSection;
