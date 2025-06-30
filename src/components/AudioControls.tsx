import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { audioManager } from "../utils/audioManager";
import { useTheme } from "../contexts/ThemeContext";

const AudioControls: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [isMuted, setIsMuted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check audio initialization status periodically
  useEffect(() => {
    const checkInitialization = () => {
      const audioInitialized = audioManager.getIsInitialized();
      if (audioInitialized !== isInitialized) {
        setIsInitialized(audioInitialized);

        // Start background music when audio becomes initialized
        if (audioInitialized && !isMuted) {
          const theme = isDarkMode ? "dark" : "light";
          audioManager.playBackgroundMusic(theme);
        }
      }
    };

    // Check immediately
    checkInitialization();

    // Check periodically in case audio gets initialized elsewhere
    const interval = setInterval(checkInitialization, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isDarkMode, isInitialized, isMuted]);

  // Update background music when theme changes
  useEffect(() => {
    if (isInitialized && !isMuted) {
      const theme = isDarkMode ? "dark" : "light";
      audioManager.playBackgroundMusic(theme);
    }
  }, [isDarkMode, isInitialized, isMuted]);

  const handleToggleMute = () => {
    const newMutedState = audioManager.toggleMute();
    setIsMuted(newMutedState);

    // If unmuting, restart background music
    if (!newMutedState && isInitialized) {
      const theme = isDarkMode ? "dark" : "light";
      audioManager.playBackgroundMusic(theme);
    }
  };

  const handlePlayResume = () => {
    handleToggleMute();
  };

  return (
    <div className="fixed top-20 right-4 z-40 flex flex-col items-end gap-2">
      {/* Main Audio Toggle Button */}
      <motion.button
        onClick={handlePlayResume}
        className={`
          p-3 rounded-full backdrop-blur-sm border transition-all duration-300 audio-cursor
          ${
            isDarkMode
              ? "bg-black/20 border-white/10 text-white/80 hover:bg-white/10"
              : "bg-white/20 border-gray-300/30 text-gray-700 hover:bg-gray-100/30"
          }
          ${isMuted ? "text-red-400" : "text-orange-400"}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2 }}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </motion.button>

      {/* Audio Initialization Hint */}
      {!isInitialized && (
        <motion.div
          className={`
            absolute top-full right-0 mt-2 p-2 rounded text-xs max-w-[180px]
            ${
              isDarkMode
                ? "bg-black/40 text-white/60 border border-white/10"
                : "bg-white/40 text-gray-600 border border-gray-300/30"
            }
          `}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          Click anywhere to enable audio
        </motion.div>
      )}
    </div>
  );
};

export default AudioControls;
