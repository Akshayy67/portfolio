import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Github, Linkedin } from "lucide-react";
import Typed from "typed.js";

const HeroSection: React.FC = () => {
  const typedRef = useRef<HTMLSpanElement>(null);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (typedRef.current) {
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
    }
  }, []);

  return (
    <section
      id="hero"
      className="min-h-screen relative flex items-center justify-center overflow-hidden"
    >
      {/* Parallax Background */}
      <div className="absolute inset-0">
        {/* Deep Space Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />

        {/* Animated Stars */}
        {[...Array(150)].map((_, i) => (
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
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 4 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Floating Space Dust */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`dust-${i}`}
            className="absolute bg-purple-400/10 rounded-full blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div
        ref={ref}
        className="relative z-10 text-center max-w-4xl mx-auto px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            <span className="text-white text-shadow-soft">Hi, I'm </span>
            <span className="interstellar-text accretion-disk">
              Akshay Juluri
            </span>
          </h1>
          <h2 className="text-2xl md:text-4xl font-mono text-white/80 mb-8 text-shadow-soft">
            Computer Science Engineer & Full Stack Developer
          </h2>
        </motion.div>

        {/* Terminal Code Animation */}
        <motion.div
          className="glass-morphism-dark noise-texture rounded-xl p-6 font-mono text-left max-w-2xl mx-auto mb-8 shadow-glow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-white/60 text-sm ml-4">
              ~/juluri-akshay-dev
            </span>
          </div>
          <div className="text-green-400 text-sm md:text-base">
            <span className="text-orange-400">$</span>{" "}
            <span ref={typedRef}></span>
          </div>
        </motion.div>

        {/* Mission Statement */}
        <motion.p
          className="text-lg md:text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed font-body text-shadow-soft"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Computer Science Engineering student at SNIST with expertise in
          multiple programming languages, machine learning, and full-stack
          development. Building innovative solutions with modern technologies.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.a
            href="#projects"
            className="px-8 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-black font-mono font-medium rounded-full hover:from-orange-300 hover:to-orange-400 transition-all duration-300 glow-accretion event-horizon-hover"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Projects
          </motion.a>
          <motion.a
            href="#contact"
            className="px-8 py-3 border border-orange-400/50 text-orange-400 font-mono font-medium rounded-full hover:bg-orange-400/10 hover:border-orange-400 transition-all duration-300 glow-accretion event-horizon-hover"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Get In Touch
          </motion.a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="flex gap-6 justify-center mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.a
            href="https://github.com/Akshayy67"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 glass-morphism-subtle rounded-full text-white/80 hover:text-orange-400 transition-all duration-300 glow-subtle event-horizon-hover"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github size={24} />
          </motion.a>
          <motion.a
            href="https://www.linkedin.com/in/akshay-juluri-84813928a/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 glass-morphism-subtle rounded-full text-white/80 hover:text-orange-400 transition-all duration-300 glow-subtle event-horizon-hover"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Linkedin size={24} />
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-orange-400/50 rounded-full p-1">
          <motion.div
            className="w-1 h-3 bg-orange-400 rounded-full mx-auto"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
