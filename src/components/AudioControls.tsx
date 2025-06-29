import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Settings, Square, Play } from "lucide-react";
import { audioManager } from "../utils/audioManager";
import { useTheme } from "../contexts/ThemeContext";

const AudioControls: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(70);
  const [showControls, setShowControls] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isStopped, setIsStopped] = useState(false);

  // Initialize audio on first user interaction
  useEffect(() => {
    const initializeAudio = async () => {
      if (!isInitialized) {
        await audioManager.initialize();
        setIsInitialized(true);

        // Start background music based on theme
        const theme = isDarkMode ? "dark" : "light";
        await audioManager.playBackgroundMusic(theme);
      }
    };

    // Initialize on first click anywhere
    const handleFirstInteraction = () => {
      initializeAudio();
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [isDarkMode, isInitialized]);

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

    // If unmuting and not stopped, restart background music
    if (!newMutedState && isInitialized && !isStopped) {
      const theme = isDarkMode ? "dark" : "light";
      audioManager.playBackgroundMusic(theme);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    audioManager.setMasterVolume(newVolume / 100);
  };

  const handleToggleControls = () => {
    setShowControls(!showControls);
  };

  const handleStopAll = () => {
    audioManager.stopAllAudio();
    setIsStopped(true);
    setIsMuted(true);
  };

  const handlePlayResume = () => {
    if (isStopped) {
      audioManager.resumeAudio();
      setIsStopped(false);
      setIsMuted(false);

      // Restart background music
      if (isInitialized) {
        const theme = isDarkMode ? "dark" : "light";
        audioManager.playBackgroundMusic(theme);
      }
    } else {
      handleToggleMute();
    }
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
          ${
            isStopped
              ? "text-gray-400"
              : isMuted
              ? "text-red-400"
              : "text-orange-400"
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2 }}
      >
        {isStopped ? (
          <Play size={20} />
        ) : isMuted ? (
          <VolumeX size={20} />
        ) : (
          <Volume2 size={20} />
        )}
      </motion.button>

      {/* Stop Button */}
      <motion.button
        onClick={handleStopAll}
        className={`
          p-2 rounded-full backdrop-blur-sm border transition-all duration-300
          ${
            isDarkMode
              ? "bg-black/20 border-white/10 text-white/60 hover:bg-red-500/20 hover:text-red-400"
              : "bg-white/20 border-gray-300/30 text-gray-600 hover:bg-red-100/30 hover:text-red-500"
          }
          ${isStopped ? "opacity-50 cursor-not-allowed" : ""}
        `}
        whileHover={!isStopped ? { scale: 1.05 } : {}}
        whileTap={!isStopped ? { scale: 0.95 } : {}}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.1 }}
        disabled={isStopped}
      >
        <Square size={16} />
      </motion.button>

      {/* Settings Button */}
      <motion.button
        onClick={handleToggleControls}
        className={`
          p-2 rounded-full backdrop-blur-sm border transition-all duration-300
          ${
            isDarkMode
              ? "bg-black/20 border-white/10 text-white/60 hover:bg-white/10"
              : "bg-white/20 border-gray-300/30 text-gray-600 hover:bg-gray-100/30"
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.3 }}
      >
        <Settings size={16} />
      </motion.button>

      {/* Expanded Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            className={`
              p-4 rounded-lg backdrop-blur-sm border min-w-[200px]
              ${
                isDarkMode
                  ? "bg-black/30 border-white/10"
                  : "bg-white/30 border-gray-300/30"
              }
            `}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-3">
              {/* Volume Control */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-white/80" : "text-gray-700"
                  }`}
                >
                  Volume: {volume}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className={`
                    w-full h-2 rounded-lg appearance-none cursor-pointer
                    ${
                      isDarkMode
                        ? "bg-white/20 slider-thumb-dark"
                        : "bg-gray-300/50 slider-thumb-light"
                    }
                  `}
                  disabled={isMuted}
                />
              </div>

              {/* Audio Status */}
              <div className="text-xs space-y-1">
                <div
                  className={`flex justify-between ${
                    isDarkMode ? "text-white/60" : "text-gray-600"
                  }`}
                >
                  <span>Status:</span>
                  <span
                    className={
                      isStopped
                        ? "text-gray-400"
                        : isMuted
                        ? "text-red-400"
                        : "text-green-400"
                    }
                  >
                    {isStopped ? "Stopped" : isMuted ? "Muted" : "Playing"}
                  </span>
                </div>
                <div
                  className={`flex justify-between ${
                    isDarkMode ? "text-white/60" : "text-gray-600"
                  }`}
                >
                  <span>Theme:</span>
                  <span className="text-orange-400">
                    {isDarkMode ? "Space Dark" : "Space Light"}
                  </span>
                </div>
                <div
                  className={`flex justify-between ${
                    isDarkMode ? "text-white/60" : "text-gray-600"
                  }`}
                >
                  <span>Quality:</span>
                  <span className="text-blue-400">Soothing</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => {
                    console.log("🔊 Test button clicked");
                    audioManager.initialize().then(() => {
                      console.log("🔊 Audio initialized, testing beep...");
                      // Test with a simple beep
                      audioManager.testAudioWithBeep();
                    });
                  }}
                  className={`
                    flex-1 py-1 px-2 rounded text-xs transition-colors
                    ${
                      isDarkMode
                        ? "bg-blue-500/20 hover:bg-blue-500/30 text-blue-400"
                        : "bg-blue-200/50 hover:bg-blue-300/50 text-blue-600"
                    }
                  `}
                >
                  Test Audio
                </button>
                <button
                  onClick={() => {
                    if (isInitialized && !isStopped) {
                      const theme = isDarkMode ? "dark" : "light";
                      audioManager.playBackgroundMusic(theme);
                    }
                  }}
                  className={`
                    flex-1 py-1 px-2 rounded text-xs transition-colors
                    ${
                      isDarkMode
                        ? "bg-white/10 hover:bg-white/20 text-white/80"
                        : "bg-gray-200/50 hover:bg-gray-300/50 text-gray-700"
                    }
                  `}
                  disabled={isMuted || isStopped}
                >
                  Restart
                </button>
                <button
                  onClick={() => setShowControls(false)}
                  className={`
                    flex-1 py-1 px-2 rounded text-xs transition-colors
                    ${
                      isDarkMode
                        ? "bg-orange-500/20 hover:bg-orange-500/30 text-orange-400"
                        : "bg-orange-200/50 hover:bg-orange-300/50 text-orange-600"
                    }
                  `}
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Audio Debug Info */}
      {showControls && (
        <motion.div
          className={`
            absolute top-full right-0 mt-2 p-2 rounded text-xs max-w-[200px]
            ${
              isDarkMode
                ? "bg-black/40 text-white/60 border border-white/10"
                : "bg-white/40 text-gray-600 border border-gray-300/30"
            }
          `}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          🎵 <strong>Soothing Space Audio:</strong> Gentle ambient sounds
          designed to be calming, not irritating. Use stop button for complete
          silence.
          <br />
          <br />
          <strong>Debug:</strong> Check browser console (F12) for audio logs.
          Click "Test Audio" to verify audio is working.
        </motion.div>
      )}
    </div>
  );
};

export default AudioControls;
