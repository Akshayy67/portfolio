import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Award, Trophy, Star } from "lucide-react";
import EnhancedParallax from "./EnhancedParallax";
import { AchievementsBackground } from "./SectionBackgrounds";

const AchievementsSection: React.FC = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

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
      className="min-h-screen py-20 relative overflow-hidden"
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
            <div className="absolute inset-0">
              {/* Victory celebration effect for mobile */}
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${20 + i * 8}%`,
                    top: `${30 + Math.sin(i) * 25}%`,
                  }}
                  animate={{
                    y: [-20, 20, -20],
                    rotate: [0, 360],
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.6, 0.2],
                  }}
                  transition={{
                    duration: 8 + i,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                >
                  <Trophy
                    className="text-orange-400/25"
                    size={16 + Math.random() * 8}
                  />
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
        <div ref={ref} className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 text-shadow-soft">
              Achievements &{" "}
              <span className="interstellar-text">Certifications</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Recognition, certifications, and milestones achieved throughout my
              journey in computer science and software development
            </p>
          </motion.div>

          {/* Certifications Section */}
          <div className="mb-16">
            <motion.h3
              className="text-3xl font-mono font-bold text-white mb-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Award className="inline mr-3 text-orange-400" size={32} />
              Certifications
            </motion.h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  className="glass-morphism-dark noise-texture rounded-xl p-6 hover:border-orange-400/50 transition-all duration-500 event-horizon-hover"
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-400/20 rounded-lg">
                      <cert.icon className="text-orange-400" size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-mono font-bold text-white mb-2 text-sm">
                        {cert.title}
                      </h4>
                      <p className="text-orange-400 text-xs font-mono mb-2">
                        {cert.provider}
                      </p>
                      <p className="text-white/70 text-xs mb-3">
                        {cert.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-1 bg-white/10 text-white/80 rounded text-xs font-mono">
                          {cert.category}
                        </span>
                        <span className="text-white/50 text-xs font-mono">
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
              className="text-3xl font-mono font-bold text-white mb-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Trophy className="inline mr-3 text-orange-400" size={32} />
              Honors & Awards
            </motion.h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  className="glass-morphism-dark noise-texture rounded-xl p-6 hover:border-orange-400/50 transition-all duration-500 event-horizon-hover"
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.7 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-400/20 rounded-lg">
                      <achievement.icon className="text-orange-400" size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-mono font-bold text-white mb-2 text-sm">
                        {achievement.title}
                      </h4>
                      <p className="text-white/70 text-xs mb-3">
                        {achievement.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-1 bg-white/10 text-white/80 rounded text-xs font-mono">
                          {achievement.category}
                        </span>
                        <span className="text-white/50 text-xs font-mono">
                          {achievement.year}
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
