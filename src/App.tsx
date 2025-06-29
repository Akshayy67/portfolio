import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LaunchSequence from "./components/LaunchSequence";
import BlackHoleScene from "./components/BlackHoleScene";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import AchievementsSection from "./components/BlogSection";
import ContactSection from "./components/ContactSection";
import Navigation from "./components/Navigation";
import ParticleBackground from "./components/ParticleBackground";
import ThemeToggle from "./components/ThemeToggle";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import VoiceNavigation from "./components/VoiceNavigation";
import HobbiesSection from "./components/HobbiesSection";
import AudioControls from "./components/AudioControls";
import GlobalCustomCursor from "./components/GlobalCustomCursor";

import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { useAnalytics } from "./hooks/useAnalytics";
import { useDeviceDetection } from "./hooks/useDeviceDetection";
import {
  registerSW,
  measurePerformance,
  preloadCriticalResources,
} from "./utils/serviceWorker";
import SmoothTransition from "./components/SmoothTransition";
import LazySection from "./components/LazySection";

// Main content component that uses theme
const MainContent: React.FC = () => {
  const { isDarkMode } = useTheme();
  const analytics = useAnalytics();
  const deviceInfo = useDeviceDetection();
  const timer1Ref = useRef<NodeJS.Timeout | null>(null);
  const timer2Ref = useRef<NodeJS.Timeout | null>(null);

  const [currentScene, setCurrentScene] = useState<
    "launch" | "blackhole" | "main"
  >("launch"); // Always start with launch sequence
  const [showNavigation, setShowNavigation] = useState(false);

  // Debug logging for scene changes
  useEffect(() => {
    console.log("Current scene changed to:", currentScene);
  }, [currentScene]);

  // Initialize app once on mount
  useEffect(() => {
    console.log("App initialized, current scene:", currentScene);
    // Initialize performance monitoring
    measurePerformance();
    preloadCriticalResources();

    // Default cursor behavior restored

    // Register service worker only in production
    if (import.meta.env.PROD) {
      registerSW({
        onSuccess: () => console.log("Service worker registered successfully"),
        onUpdate: () => console.log("New content available"),
        onOfflineReady: () => console.log("App ready for offline use"),
      });
    }

    return () => {
      // Cleanup
    };
  }, []); // Run only once on mount

  // Handle animation sequence based on device preferences
  useEffect(() => {
    console.log("Device info:", deviceInfo);
    console.log("Prefers reduced motion:", deviceInfo.prefersReducedMotion);

    // Auto-skip animations only if user explicitly prefers reduced motion
    // TEMPORARILY DISABLED FOR DEBUGGING
    // if (deviceInfo.prefersReducedMotion) {
    //   console.log("Skipping animations due to reduced motion preference");
    //   setCurrentScene("main");
    //   setShowNavigation(true);
    //   return;
    // }

    // Only start timer if we're in launch scene
    if (currentScene === "launch") {
      console.log("Starting launch sequence timer");
      timer1Ref.current = setTimeout(() => {
        console.log("🌌 Timer 1 fired: Transitioning to blackhole");
        setCurrentScene("blackhole");
      }, 6000); // 6 seconds total for launch sequence
    }

    return () => {
      if (timer1Ref.current) clearTimeout(timer1Ref.current);
      if (timer2Ref.current) clearTimeout(timer2Ref.current);
    };
  }, [deviceInfo.prefersReducedMotion, currentScene]);

  // Handle black hole sequence completion
  const handleBlackHoleComplete = () => {
    console.log("🏠 Black hole sequence completed: Transitioning to main");
    setCurrentScene("main");
    setShowNavigation(true);
  };

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

      // Press 'R' to restart animations when on main page
      if (e.code === "KeyR" && currentScene === "main") {
        e.preventDefault();
        restartAnimations();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentScene]);

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

    // Scroll to about section after a brief delay to ensure content is loaded
    setTimeout(() => {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 500);
  };

  const restartAnimations = () => {
    setCurrentScene("launch");
    setShowNavigation(false);
    analytics.trackEvent("animations_restarted", { trigger: "manual" });
  };

  console.log("App rendering, currentScene:", currentScene);

  return (
    <div className="relative">
      {/* Global custom cursor - works everywhere */}
      <GlobalCustomCursor />

      <AnimatePresence mode="wait">
        {currentScene === "launch" && (
          <LaunchSequence key="launch" onSkip={skipToMain} />
        )}
        {currentScene === "blackhole" && (
          <BlackHoleScene
            key="blackhole"
            onSkip={skipToMain}
            onComplete={handleBlackHoleComplete}
          />
        )}
        {currentScene === "main" && (
          <div
            key="main"
            className={`min-h-screen relative overflow-x-hidden transition-all duration-1000 ${
              isDarkMode
                ? "bg-black text-white"
                : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
            }`}
          >
            {/* Simplified Background */}
            <div className="fixed inset-0 z-0">
              {isDarkMode ? (
                <div className="absolute inset-0 bg-black" />
              ) : (
                <div className="absolute inset-0 bg-white" />
              )}
            </div>

            {/* Navigation and Content */}
            {showNavigation && <Navigation />}
            <ThemeToggle />
            <AudioControls />

            <VoiceNavigation />
            <AnalyticsDashboard />

            <HeroSection />

            <AboutSection />
            <HobbiesSection />
            <ProjectsSection />
            <AchievementsSection />
            <ContactSection />
          </div>
        )}
      </AnimatePresence>
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
