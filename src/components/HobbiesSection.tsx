import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Guitar, Trophy, Crown, Plane } from "lucide-react";
import { useDeviceDetection } from "../hooks/useDeviceDetection";
import EnhancedParallax from "./EnhancedParallax";
import { HobbiesBackground } from "./SectionBackgrounds";
import { useTheme } from "../contexts/ThemeContext";

const HobbiesSection: React.FC = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const deviceInfo = useDeviceDetection();
  const { isDarkMode } = useTheme();

  const hobbies = [
    { text: "play guitar", icon: Guitar, color: "text-purple-400" },
    { text: "play cricket", icon: Trophy, color: "text-green-400" },
    { text: "play chess", icon: Crown, color: "text-blue-400" },
    { text: "travel a lot", icon: Plane, color: "text-orange-400" },
  ];

  const [currentHobbyIndex, setCurrentHobbyIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const currentHobby = hobbies[currentHobbyIndex];
    const targetText = currentHobby.text;

    const timer = setTimeout(
      () => {
        if (isTyping) {
          // Typing phase
          if (charIndex < targetText.length) {
            setDisplayText(targetText.slice(0, charIndex + 1));
            setCharIndex(charIndex + 1);
          } else {
            // Finished typing, wait then start deleting
            setTimeout(() => setIsTyping(false), 2000);
          }
        } else {
          // Deleting phase
          if (charIndex > 0) {
            setDisplayText(targetText.slice(0, charIndex - 1));
            setCharIndex(charIndex - 1);
          } else {
            // Finished deleting, move to next hobby
            setIsTyping(true);
            setCurrentHobbyIndex((prev) => (prev + 1) % hobbies.length);
          }
        }
      },
      isTyping
        ? deviceInfo.isMobile
          ? 150
          : 100
        : deviceInfo.isMobile
        ? 75
        : 50
    ); // Typing is slower than deleting, even slower on mobile for better readability

    return () => clearTimeout(timer);
  }, [inView, currentHobbyIndex, charIndex, isTyping, hobbies]);

  const currentHobby = hobbies[currentHobbyIndex];

  return (
    <EnhancedParallax
      className={`py-16 relative overflow-hidden skills-section ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}
      intensity="subtle"
      backgroundLayers={[
        {
          children: <HobbiesBackground />,
          speed: 0.2,
          direction: "up",
          className: "z-0",
        },
        {
          children: (
            <div className="absolute inset-0">
              {/* Hobby-specific floating elements for mobile */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: `${25 + i * 18}%`,
                    top: `${35 + Math.sin(i) * 20}%`,
                    backgroundColor:
                      ["#a855f7", "#22c55e", "#3b82f6", "#f97316"][i] + "40",
                  }}
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.3, 0.7, 0.3],
                    y: [-10, 10, -10],
                  }}
                  transition={{
                    duration: 5 + i * 2,
                    repeat: Infinity,
                    delay: i * 1.2,
                  }}
                />
              ))}
            </div>
          ),
          speed: 0.4,
          direction: "down",
          className: "z-1",
        },
      ]}
    >
      <section data-section="skills" className="relative z-10">
        <div ref={ref} className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className={`text-2xl md:text-4xl font-display font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Apart from coding, I also...
            </h2>

            <div className={`glass-morphism-dark rounded-2xl p-8 md:p-12 shadow-glow-lg ${isDarkMode ? '' : 'bg-white/80 border border-orange-200 shadow-glow-md'}`}>
              <div className="flex items-center justify-center gap-4 text-3xl md:text-5xl font-mono">
                <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>...</span>

                {/* Animated Icon */}
                <motion.div
                  key={currentHobbyIndex}
                  className={`${currentHobby.color}`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                >
                  <currentHobby.icon size={48} className="md:w-16 md:h-16" />
                </motion.div>

                {/* Typing Text */}
                <div className={`relative`}>
                  <span className={`${currentHobby.color} font-bold`}>
                    {displayText}
                  </span>

                  {/* Blinking Cursor */}
                  <motion.span
                    className={`${currentHobby.color} ml-1`}
                    animate={{ opacity: [1, 0] }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    |
                  </motion.span>
                </div>
              </div>

              {/* Hobby Indicators */}
              <div className="flex justify-center gap-3 mt-8">
                {hobbies.map((hobby, index) => (
                  <motion.div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentHobbyIndex
                        ? (isDarkMode ? hobby.color.replace('text-', 'bg-') : 'bg-amber-400')
                        : (isDarkMode ? 'bg-white/20' : 'bg-orange-100')
                    }`}
                    whileHover={{ scale: 1.2 }}
                    animate={{
                      scale: index === currentHobbyIndex ? 1.2 : 1,
                    }}
                  />
                ))}
              </div>

              {/* Fun Description */}
              <motion.p
                className={`text-lg mt-6 max-w-2xl mx-auto ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                When I'm not immersed in code, you'll find me exploring these
                passions that keep me balanced and inspired.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>
    </EnhancedParallax>
  );
};

export default HobbiesSection;
