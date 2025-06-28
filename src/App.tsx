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

function App() {
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
            className="min-h-screen bg-black text-white relative overflow-x-hidden"
          >
            {/* Interstellar Background Elements */}
            <div className="fixed inset-0 z-0">
              {/* Distant Stars */}
              {[...Array(100)].map((_, i) => (
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

              {/* Accretion Disk Glow */}
              <div className="absolute inset-0 bg-gargantua opacity-40" />

              {/* Deep Space Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/10 to-black" />

              {/* Event Horizon Effect */}
              <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/60" />
            </div>
            {showNavigation && <Navigation />}
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
}

export default App;
