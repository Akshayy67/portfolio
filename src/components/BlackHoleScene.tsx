import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

interface BlackHoleSceneProps {
  onSkip: () => void;
}

const BlackHoleScene: React.FC<BlackHoleSceneProps> = ({ onSkip }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black overflow-hidden flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Skip Button */}
      <button
        onClick={onSkip}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors font-mono text-sm"
      >
        <Play size={16} />
        Skip Intro
      </button>

      {/* Background Stars */}
      <div className="absolute inset-0">
        {[...Array(200)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Black Hole */}
      <motion.div
        className="relative"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        {/* Accretion Disk */}
        <motion.div
          className="relative w-96 h-96 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, 
              transparent 0deg,
              rgba(251, 146, 60, 0.2) 30deg,
              rgba(251, 146, 60, 0.8) 60deg,
              rgba(255, 255, 255, 1) 90deg,
              rgba(251, 146, 60, 0.8) 120deg,
              rgba(251, 146, 60, 0.2) 150deg,
              transparent 180deg,
              rgba(251, 146, 60, 0.1) 210deg,
              rgba(251, 146, 60, 0.6) 240deg,
              rgba(255, 255, 255, 0.8) 270deg,
              rgba(251, 146, 60, 0.6) 300deg,
              rgba(251, 146, 60, 0.1) 330deg,
              transparent 360deg
            )`
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Event Horizon */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-black rounded-full border border-orange-400/20" />
        </motion.div>

        {/* Gravitational Lensing Effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, 
              transparent 20%,
              rgba(251, 146, 60, 0.1) 40%,
              transparent 60%,
              rgba(255, 255, 255, 0.05) 80%,
              transparent 100%
            )`
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Text Overlay */}
      <motion.div
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <div className="font-mono text-orange-400 text-xl mb-2">
          Warping into the Developer Galaxy...
        </div>
        <div className="font-mono text-white/60 text-sm">
          Gravitational time dilation in progress
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BlackHoleScene;