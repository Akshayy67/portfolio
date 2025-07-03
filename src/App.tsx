import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import Navigation from "./components/Navigation";
import ParticleBackground from "./components/ParticleBackground";
import ThemeToggle from "./components/ThemeToggle";
import GlobalCustomCursor from "./components/GlobalCustomCursor";
import { WarpSpeedEffect } from "./components/LaunchSequence";

// Lazy load heavy components
const ProjectsSection = lazy(() => import("./components/ProjectsSection"));
const AchievementsSection = lazy(() => import("./components/BlogSection"));
const ContactSection = lazy(() => import("./components/ContactSection"));
const AnalyticsDashboard = lazy(() => import("./components/AnalyticsDashboard"));
const VoiceNavigation = lazy(() => import("./components/VoiceNavigation"));
const HobbiesSection = lazy(() => import("./components/HobbiesSection"));

import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { useAnalytics } from "./hooks/useAnalytics";
import { useDeviceDetection } from "./hooks/useDeviceDetection";
import SmoothTransition from "./components/SmoothTransition";
import LazySection from "./components/LazySection";


// Loading component for lazy-loaded sections
const SectionLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-white/60 font-mono text-sm">Loading...</p>
    </div>
  </div>
);

// Main content component that uses theme
const MainContent: React.FC = () => {
  const { isDarkMode } = useTheme();
  const analytics = useAnalytics();
  const deviceInfo = useDeviceDetection();
  const timer1Ref = useRef<NodeJS.Timeout | null>(null);
  const timer2Ref = useRef<NodeJS.Timeout | null>(null);

  const [currentScene, setCurrentScene] = useState<"launch" | "main">("launch"); // Always start with launch sequence
  const [showNavigation, setShowNavigation] = useState(false);
  const [showWarpIntro, setShowWarpIntro] = useState(true);

  // Initialize app once on mount
  useEffect(() => {
    // Default cursor behavior restored

    return () => {
      // Cleanup
    };
  }, []); // Run only once on mount

  // Handle animation sequence based on device preferences
  useEffect(() => {
    // Auto-skip animations only if user explicitly prefers reduced motion
    // TEMPORARILY DISABLED FOR DEBUGGING
    // if (deviceInfo.prefersReducedMotion) {
    //   setCurrentScene("main");
    //   setShowNavigation(true);
    //   return;
    // }

    // Let the LaunchSequence component handle its own timing
    // No need for App-level timer since LaunchSequence will call onSkip when done

    return () => {
      if (timer1Ref.current) clearTimeout(timer1Ref.current);
      if (timer2Ref.current) clearTimeout(timer2Ref.current);
    };
  }, [deviceInfo.prefersReducedMotion, currentScene]);

  // Separate useEffect for keyboard events
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        (e.code === "Space" || e.code === "Enter") &&
        currentScene !== "main"
      ) {
        e.preventDefault();
        skipToMain();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentScene]);

  useEffect(() => {
    const timer = setTimeout(() => setShowWarpIntro(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showWarpIntro) {
      setShowNavigation(true);
    }
  }, [showWarpIntro]);

  const skipToMain = () => {
    // Clear any pending timers to prevent automatic transitions
    if (timer1Ref.current) {
      clearTimeout(timer1Ref.current);
      timer1Ref.current = null;
    }
    if (timer2Ref.current) {
      clearTimeout(timer2Ref.current);
      timer2Ref.current = null;
    }

    // Immediate state update
    setCurrentScene("main");
    setShowNavigation(true);

    // Scroll to hero section after a brief delay to ensure content is loaded
    setTimeout(() => {
      const heroSection = document.getElementById("hero");
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // Fallback: scroll to top if hero section not found
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 500);
  };

  return (
    <div className="relative">
      {/* Global custom cursor - works everywhere */}
      <GlobalCustomCursor />

      <div
        key="main"
        className={`min-h-screen relative overflow-x-hidden transition-all duration-1000 bg-transparent ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {/* Navigation and Content */}
        {showNavigation && <Navigation />}
        <ThemeToggle />

        <Suspense fallback={null}>
          <VoiceNavigation />
        </Suspense>
        <Suspense fallback={null}>
          <AnalyticsDashboard />
        </Suspense>

        {showWarpIntro ? (
          <div className="fixed inset-0 z-[9999] bg-black">
            <WarpSpeedEffect />
          </div>
        ) : (
          <>
            <HeroSection />
            <AboutSection />
            <HobbiesSection />
            <Suspense fallback={<SectionLoader />}>
              <ProjectsSection />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
              <AchievementsSection />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
              <ContactSection />
            </Suspense>
          </>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
}

export default App;
