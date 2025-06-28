import { useState, useEffect } from "react";
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
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { useAnalytics } from "./hooks/useAnalytics";

// Main content component that uses theme
const MainContent: React.FC = () => {
  const { isDarkMode } = useTheme();
  const analytics = useAnalytics();
  const [currentScene, setCurrentScene] = useState<
    "launch" | "blackhole" | "main"
  >("launch");
  const [showNavigation, setShowNavigation] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCurrentScene("blackhole");
    }, 6000);

    const timer2 = setTimeout(() => {
      setCurrentScene("main");
      setShowNavigation(true);
    }, 12000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const skipToMain = () => {
    setCurrentScene("main");
    setShowNavigation(true);
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
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
              {/* Particle Background */}
              <ParticleBackground isDarkMode={isDarkMode} />

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
            <AboutSection />
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
