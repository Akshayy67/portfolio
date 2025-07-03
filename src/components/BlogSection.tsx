import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Award, Trophy, Star, BadgeCheck, Crown } from "lucide-react";
import EnhancedParallax from "./EnhancedParallax";
import { AchievementsBackground } from "./SectionBackgrounds";
import { useTheme } from "../contexts/ThemeContext";

const AchievementsSection: React.FC = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const { isDarkMode } = useTheme();
  const [trophyFlood, setTrophyFlood] = useState(false);

  const certifications = [
    {
      id: 1,
      title: "Supervised Machine Learning: Regression and Classification",
      provider: "DeepLearning.AI, Stanford University (Coursera)",
      date: "2024",
      category: "Machine Learning",
      icon: Award,
      description:
        "Comprehensive course covering regression and classification algorithms",
    },
    {
      id: 2,
      title: "ServiceNow SNAF,CAD badges",
      provider: "ServiceNow",
      date: "2024",
      category: "Platform Development",
      icon: Star,
      description:
        "ServiceNow Application Development and Configuration badges",
    },
    {
      id: 3,
      title: "Juniper Networks Virtual Internship",
      provider: "Juniper Networks",
      date: "2024",
      category: "Networking",
      icon: Award,
      description:
        "Virtual internship program focusing on network technologies",
    },
  ];

  const achievements = [
    {
      id: 1,
      title: "Won Summer Hackathon at SNIST",
      description: "First place winner in the summer hackathon competition",
      category: "Competition",
      icon: Trophy,
      year: "2024",
      featured: true,
    },
    {
      id: 2,
      title: "100Days Leetcoding badge",
      description: "500+ solved problems on Leetcode, #Contest rating - 1,600+",
      category: "Programming",
      icon: Star,
      year: "2024",
    },
    {
      id: 3,
      title: "Hackathon finalist at SNIST by swedha(IIIT Hyderabad)",
      description:
        "Finalist in prestigious hackathon organized by IIIT Hyderabad",
      category: "Competition",
      icon: Award,
      year: "2024",
    },
  ];

  return (
    <EnhancedParallax
      className={`min-h-screen py-20 relative overflow-hidden ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}
      intensity="medium"
      backgroundLayers={[
        {
          children: <AchievementsBackground />,
          speed: 0.3,
          direction: "up",
          className: "z-0",
        },
        {
          children: (
            <div className="absolute inset-0 pointer-events-none">
              {/* Animated confetti/sparkles */}
              {[...Array(18)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, 40 + Math.random() * 40, 0],
                    opacity: [0.7, 0.2, 0.7],
                    scale: [1, 1.3, 1],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 7 + Math.random() * 3,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  {i % 3 === 0 ? (
                    <Trophy className="text-orange-400 drop-shadow-glow" size={18} />
                  ) : i % 3 === 1 ? (
                    <Star className="text-yellow-400 drop-shadow-glow" size={16} />
                  ) : (
                    <BadgeCheck className="text-amber-500 drop-shadow-glow" size={16} />
                  )}
                </motion.div>
              ))}
            </div>
          ),
          speed: 0.5,
          direction: "down",
          className: "z-1",
        },
      ]}
    >
      <section id="achievements" className="relative z-10">
        {/* Soft celebratory background with floating trophies and medals */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Minimal radial orange/gold gradient */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[60vw] max-w-7xl max-h-[40rem]"
            style={{
              filter: "blur(80px)",
              opacity: 0.10,
              background: "radial-gradient(circle at 50% 50%, #fb923c 0%, #ffd700 60%, transparent 100%)",
            }}
          />
          {/* Minimal floating trophy and medal icons */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${10 + i * 10 + Math.sin(i) * 5}%`,
                top: `${20 + Math.cos(i) * 30}%`,
              }}
              animate={{
                y: [0, 20, 0],
                opacity: [0.12, 0.22, 0.12],
                scale: [1, 1.1, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 10 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              {i % 2 === 0 ? (
                <Trophy className="text-orange-400" size={32} />
              ) : (
                <BadgeCheck className="text-yellow-400" size={28} />
              )}
            </motion.div>
          ))}
        </div>
        <div ref={ref} className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className={`text-4xl md:text-6xl font-display font-bold mb-4 text-shadow-soft ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Achievements &{" "}
              <span className="interstellar-text">Certifications</span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}>
              Recognition, certifications, and milestones achieved throughout my
              journey in computer science and software development
            </p>
          </motion.div>

          {/* Certifications Section */}
          <div className="mb-16">
            <motion.h3
              className={`text-3xl font-mono font-bold mb-8 text-center`}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Award className={`text-orange-400 drop-shadow-glow animate-pulse`} size={32} />
              Certifications
            </motion.h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  className={`glass-morphism-dark noise-texture rounded-xl p-6 hover:border-orange-400/70 transition-all duration-500 event-horizon-hover ${isDarkMode ? '' : 'bg-white/90 border-orange-200 text-gray-900 shadow-glow-md'} border-2 border-transparent relative overflow-hidden`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                >
                  {/* Animated shine on hover */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.25 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="absolute -left-1/4 top-1/4 w-2/3 h-2/3 bg-gradient-to-r from-orange-200 via-white to-orange-100 rounded-full blur-2xl opacity-70 animate-pulse" />
                  </motion.div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-400/20 rounded-lg shadow-glow-md animate-pulse">
                      <cert.icon className="text-orange-400 drop-shadow-glow animate-bounce" size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-mono font-bold mb-2 text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {cert.title}
                      </h4>
                      <p className={isDarkMode ? 'text-orange-400 text-xs font-mono mb-2' : 'text-amber-600 text-xs font-mono mb-2'}>
                        {cert.provider}
                      </p>
                      <p className={`text-xs mb-3 ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}>
                        {cert.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? 'bg-white/10 text-white/80' : 'bg-orange-100 text-gray-900'}`}
                          style={{
                            background: 'linear-gradient(90deg, #ffd70033 0%, #fb923c33 100%)',
                            border: '1px solid #fb923c',
                          }}
                        >
                          {cert.category}
                        </span>
                        <span className={`text-xs font-mono ${isDarkMode ? 'text-white/50' : 'text-gray-400'}`}>
                          {cert.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Achievements Section */}
          <div>
            <motion.h3
              className={`text-3xl font-mono font-bold mb-8 text-center`}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Trophy className={`text-orange-400 drop-shadow-glow animate-pulse`} size={32} />
              Achievements
            </motion.h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((ach, index) => (
                <motion.div
                  key={ach.id}
                  className={`glass-morphism-dark noise-texture rounded-xl p-6 transition-all duration-500 event-horizon-hover ${isDarkMode ? '' : 'bg-white/90 border-orange-200 text-gray-900 shadow-glow-md'} border-2 relative overflow-hidden
                    ${ach.featured ? 'border-yellow-400 shadow-[0_0_32px_4px_rgba(251,191,36,0.25)] animate-pulse' : 'border-transparent'}
                  `}
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                >
                  {/* Crown for top achievement */}
                  {ach.featured && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20">
                      <Crown className="text-yellow-400 drop-shadow-glow animate-bounce" size={40} />
                    </div>
                  )}
                  {/* Trophy Flood Button and Effect for top achievement */}
                  {ach.featured && (
                    <>
                      <button
                        className="absolute top-3 left-3 bg-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-glow-md hover:bg-orange-500 transition z-20"
                        onClick={() => {
                          setTrophyFlood(true);
                          setTimeout(() => setTrophyFlood(false), 1800);
                        }}
                      >
                        Celebrate!
                      </button>
                      {trophyFlood && (
                        <div className="pointer-events-none absolute inset-0 z-30">
                          {[...Array(24)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute"
                              style={{
                                left: `${30 + Math.random() * 40}%`,
                                top: `50%`,
                              }}
                              initial={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
                              animate={{
                                y: [-10, -120 - Math.random() * 120],
                                x: [0, (Math.random() - 0.5) * 300],
                                opacity: [1, 0.7, 0],
                                scale: [1, 1.3, 0.8],
                                rotate: [0, Math.random() * 360],
                              }}
                              transition={{
                                duration: 1.2 + Math.random() * 0.5,
                                ease: "easeOut",
                              }}
                            >
                              <Trophy className="text-orange-400 drop-shadow-glow" size={28 + Math.random() * 10} />
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-400/20 rounded-lg shadow-glow-md animate-pulse">
                      <ach.icon className="text-orange-400 drop-shadow-glow animate-bounce" size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-mono font-bold mb-2 text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {ach.title}
                      </h4>
                      <p className={`text-xs mb-3 ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}>
                        {ach.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? 'bg-white/10 text-white/80' : 'bg-orange-100 text-gray-900'}`}
                          style={{
                            background: 'linear-gradient(90deg, #ffd70033 0%, #fb923c33 100%)',
                            border: '1px solid #fb923c',
                          }}
                        >
                          {ach.category}
                        </span>
                        <span className={`text-xs font-mono ${isDarkMode ? 'text-white/50' : 'text-gray-400'}`}>
                          {ach.year}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </EnhancedParallax>
  );
};

export default AchievementsSection;
