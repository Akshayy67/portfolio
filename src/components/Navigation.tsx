import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Rocket, Github, Linkedin } from "lucide-react";
import { scrollToSection } from "../utils/smoothScroll";
import { useTheme } from "../contexts/ThemeContext";

const Navigation: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Update background state
      setScrolled(currentScrollY > 50);

      // Hide/show logic
      if (currentScrollY < 10) {
        // Always show at very top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide
        setIsVisible(false);
        setIsOpen(false); // Close mobile menu
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
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled
              ? "glass-morphism-dark shadow-glow-lg backdrop-blur-md"
              : "bg-transparent"
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <motion.div
                className="flex items-center gap-2 font-mono text-orange-400 text-xl font-bold cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={() => scrollToSection("hero", 0)}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Rocket size={24} />
                </motion.div>
                <span className="hidden sm:inline">Akshay Juluri</span>
                <span className="sm:hidden">AJ</span>
              </motion.div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {navItems.map((item) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className="relative font-mono text-white/80 hover:text-orange-400 transition-colors duration-200 cursor-pointer group"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
                  </motion.a>
                ))}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <motion.button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-white/80 hover:text-orange-400 transition-colors p-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className={`md:hidden absolute top-full left-0 right-0 backdrop-blur-md border-t border-orange-400/20 ${
                  isDarkMode ? "bg-black/95" : "bg-white/95"
                }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-4 py-4 space-y-2">
                  {navItems.map((item) => (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.id)}
                      className="block px-4 py-3 font-mono text-white/80 hover:text-orange-400 hover:bg-orange-400/10 rounded-lg transition-all duration-200 cursor-pointer"
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.name}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default Navigation;
