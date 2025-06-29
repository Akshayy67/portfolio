import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
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
  >(
    deviceInfo.isMobile ||
      deviceInfo.isLowEndDevice ||
      deviceInfo.prefersReducedMotion
      ? "main"
      : "launch"
  );
  const [showNavigation, setShowNavigation] = useState(
    deviceInfo.isMobile ||
      deviceInfo.isLowEndDevice ||
      deviceInfo.prefersReducedMotion
  );

  useEffect(() => {
    // Initialize performance monitoring
    measurePerformance();
    preloadCriticalResources();

    // Register service worker only in production
    if (import.meta.env.PROD) {
      registerSW({
        onSuccess: () => console.log("Service worker registered successfully"),
        onUpdate: () => console.log("New content available"),
        onOfflineReady: () => console.log("App ready for offline use"),
      });
    }

    // Skip animations on mobile, low-end devices, or when user prefers reduced motion
    if (
      deviceInfo.isMobile ||
      deviceInfo.isLowEndDevice ||
      deviceInfo.prefersReducedMotion
    ) {
      setCurrentScene("main");
      setShowNavigation(true);
      return;
    }

    timer1Ref.current = setTimeout(() => {
      setCurrentScene("blackhole");
    }, 6000);

    timer2Ref.current = setTimeout(() => {
      setCurrentScene("main");
      setShowNavigation(true);
    }, 12000);

    return () => {
      if (timer1Ref.current) clearTimeout(timer1Ref.current);
      if (timer2Ref.current) clearTimeout(timer2Ref.current);
    };
  }, [
    deviceInfo.isMobile,
    deviceInfo.isLowEndDevice,
    deviceInfo.prefersReducedMotion,
  ]);

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

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {currentScene === "launch" && (
          <LaunchSequence key="launch" onSkip={skipToMain} />
        )}
        {currentScene === "blackhole" && (
          <BlackHoleScene key="blackhole" onSkip={skipToMain} />
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
            {/* Enhanced Background Elements */}
            <div className="fixed inset-0 z-0">
              {/* Particle Background - Optimized for mobile */}
              {!deviceInfo.isMobile &&
                !deviceInfo.isLowEndDevice &&
                !deviceInfo.prefersReducedMotion && (
                  <ParticleBackground isDarkMode={isDarkMode} />
                )}

              {/* Distant Stars (only in dark mode) */}
              {isDarkMode &&
                [...Array(100)].map((_, i) => (
                  <div
                    key={`star-${i}`}
                    className="absolute bg-white rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      width: `${Math.random() * 2 + 0.5}px`,
                      height: `${Math.random() * 2 + 0.5}px`,
                      opacity: Math.random() * 0.8 + 0.2,
                      animation: `twinkle ${
                        Math.random() * 4 + 2
                      }s ease-in-out infinite`,
                      animationDelay: `${Math.random() * 4}s`,
                    }}
                  />
                ))}

              {/* Theme-based gradients */}
              {isDarkMode ? (
                <>
                  <div className="absolute inset-0 bg-gargantua opacity-40" />
                  <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/10 to-black" />
                  <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/60" />
                </>
              ) : (
                <>
                  {/* Gargantua Black Hole Effect for Light Theme */}
                  <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-20">
                    {/* Event Horizon */}
                    <div className="absolute inset-0 rounded-full bg-gradient-radial from-black via-gray-800 to-transparent animate-pulse" />

                    {/* Accretion Disk */}
                    <div
                      className="absolute inset-4 rounded-full bg-gradient-to-r from-orange-600 via-yellow-500 to-orange-600 opacity-60 animate-spin"
                      style={{ animationDuration: "20s" }}
                    />
                    <div
                      className="absolute inset-8 rounded-full bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 opacity-40 animate-spin"
                      style={{
                        animationDuration: "15s",
                        animationDirection: "reverse",
                      }}
                    />

                    {/* Photon Sphere */}
                    <div className="absolute inset-12 rounded-full border-2 border-orange-300 opacity-30 animate-ping" />
                  </div>

                  {/* Subtle space distortion */}
                  <div className="absolute inset-0 bg-gradient-radial from-transparent via-gray-50/30 to-white/80" />

                  {/* Light rays */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 via-transparent to-yellow-100/20" />
                </>
              )}
            </div>

            {/* Navigation and Content */}
            {showNavigation && <Navigation />}
            <ThemeToggle />
            <VoiceNavigation />
            <AnalyticsDashboard />

            <HeroSection />

            <SmoothTransition direction="up" duration={0.8} delay={0.2}>
              <AboutSection />
            </SmoothTransition>

            <SmoothTransition direction="fade" duration={0.6} delay={0.1}>
              <HobbiesSection />
            </SmoothTransition>

            <SmoothTransition direction="up" duration={0.8} stagger={true}>
              <ProjectsSection />
            </SmoothTransition>

            <SmoothTransition direction="scale" duration={0.6}>
              <AchievementsSection />
            </SmoothTransition>

            <SmoothTransition direction="up" duration={0.8} delay={0.3}>
              <ContactSection />
            </SmoothTransition>
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
