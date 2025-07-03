import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Rocket, Github, Linkedin } from "lucide-react";
import { scrollToSection } from "../utils/smoothScroll";
import { useTheme } from "../contexts/ThemeContext";

// UFO SVG must be a React.FC for type safety
const UFO: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="80" height="54" viewBox="0 0 80 54" fill="none" {...props}>
    {/* Main body */}
    <ellipse cx="40" cy="40" rx="30" ry="10" fill="#b3e5fc" />
    <ellipse cx="40" cy="28" rx="20" ry="10" fill="#90caf9" />
    <ellipse cx="40" cy="28" rx="14" ry="5" fill="#fff" />
    <rect x="32" y="18" width="16" height="6" rx="3" fill="#607d8b" />
    <ellipse cx="40" cy="18" rx="7" ry="3" fill="#b3e5fc" />
    {/* Blinking lights */}
    <circle cx="26" cy="28" r="2" fill="#ff5252">
      <animate attributeName="opacity" values="1;0.2;1" dur="1s" repeatCount="indefinite" />
    </circle>
    <circle cx="54" cy="28" r="2" fill="#ffeb3b">
      <animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite" />
    </circle>
    <circle cx="40" cy="38" r="2" fill="#69f0ae">
      <animate attributeName="opacity" values="1;0.2;1" dur="0.8s" repeatCount="indefinite" />
    </circle>
  </svg>
);

const Navigation: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [abduct, setAbduct] = useState(false);

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
                className="flex items-center gap-2 font-mono text-orange-400 text-xl font-bold cursor-pointer relative"
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setAbduct(true);
                  setTimeout(() => {
                    setAbduct(false);
                    scrollToSection("hero", 0);
                  }, 2200); // Duration of abduction animation
                }}
                style={{ minWidth: 120 }}
              >
                {/* UFO Animation */}
                <AnimatePresence>
                  {abduct ? (
                    <motion.div
                      key="ufo"
                      initial={{ y: -100, x: 0, opacity: 0 }}
                      animate={{ y: -30, x: 40, opacity: 1 }}
                      exit={{ y: -100, x: 100, opacity: 0 }}
                      transition={{ duration: 0.9 }}
                      style={{ position: "absolute", left: -20, top: -90, zIndex: 10 }}
                    >
                      <UFO />
                      {/* Dramatic Beam */}
                      <motion.div
                        key="beam"
                        initial={{ opacity: 0, scaleY: 0.5 }}
                        animate={{ opacity: 0.8, scaleY: [0.5, 1.2, 1] }}
                        exit={{ opacity: 0, scaleY: 0.5 }}
                        style={{
                          position: "absolute",
                          left: 32,
                          top: 54,
                          width: 24,
                          height: 80,
                          background: "radial-gradient(ellipse at center, #b3e5fc 60%, #fffde4 100%)",
                          borderRadius: 16,
                          filter: "blur(4px)",
                          zIndex: 1,
                          pointerEvents: "none",
                        }}
                        transition={{ duration: 0.7, repeat: 0 }}
                      />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                {/* Rocket Animation */}
                <motion.div
                  animate={abduct
                    ? { y: -60, opacity: 0 }
                    : { y: [0, -10, 0], opacity: 1, rotate: 360 }}
                  transition={{
                    y: abduct
                      ? { duration: 1.4, ease: [0.4, 0.0, 0.2, 1] }
                      : { duration: 1.2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
                    opacity: { duration: 0.7 },
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  }}
                  style={{ zIndex: 2 }}
                >
                  <Rocket size={32} />
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
