import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Rocket, Github, Linkedin } from "lucide-react";
import { scrollToSection } from "../utils/smoothScroll";

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Update scrolled state for background
      setScrolled(currentScrollY > 50);

      // Smart hide/show logic
      if (currentScrollY < 50) {
        // Always show at top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past threshold - hide
        setIsVisible(false);
        setIsOpen(false); // Close mobile menu when hiding
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { name: "Home", href: "#hero", id: "hero" },
    { name: "About", href: "#about", id: "about" },
    { name: "Projects", href: "#projects", id: "projects" },
    { name: "Achievements", href: "#achievements", id: "achievements" },
    { name: "Contact", href: "#contact", id: "contact" },
  ];

  const handleNavClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();

    // Add visual feedback
    const target = e.currentTarget;
    target.style.transform = "scale(0.95)";

    // Close mobile menu immediately for better UX
    setIsOpen(false);

    // Perform smooth scroll with optimized settings
    try {
      await scrollToSection(id, 80); // 80px offset for fixed header
    } catch (error) {
      console.warn("Scroll animation interrupted:", error);
    }

    // Reset visual feedback
    setTimeout(() => {
      target.style.transform = "";
    }, 150);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-morphism-dark shadow-glow-lg" : "bg-transparent"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
        delay: isVisible ? 0 : 0,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-1.5 sm:gap-2 font-mono text-orange-400 text-lg sm:text-xl font-bold event-horizon-hover"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="glow-accretion"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              <Rocket size={20} className="sm:w-6 sm:h-6" />
            </motion.div>
            <span className="glow-starlight hidden xs:inline sm:inline">
              Akshay Juluri
            </span>
            <span className="glow-starlight xs:hidden sm:hidden">AJ</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation Items */}
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className="font-mono text-white/80 hover:text-orange-400 transition-all duration-200 ease-out text-sm event-horizon-hover relative group cursor-pointer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300 group-hover:w-full"></span>
                </motion.a>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 ml-6 pl-6 border-l border-white/10">
              <motion.a
                href="https://github.com/Akshayy67"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-orange-400 transition-all duration-300 event-horizon-hover"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github size={20} />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/akshay-juluri-84813928a/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-orange-400 transition-all duration-300 event-horizon-hover"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin size={20} />
              </motion.a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white/80 hover:text-orange-400 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        className={`md:hidden ${isOpen ? "block" : "hidden"}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? "auto" : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-black/95 backdrop-blur-sm">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.id)}
              className="block px-3 py-2 font-mono text-white/80 hover:text-orange-400 transition-colors text-sm cursor-pointer"
            >
              {item.name}
            </a>
          ))}

          {/* Mobile Social Links */}
          <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-white/10">
            <a
              href="https://github.com/Akshayy67"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-orange-400 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Github size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/akshay-juluri-84813928a/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-orange-400 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navigation;
