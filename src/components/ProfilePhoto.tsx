import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

interface ProfilePhotoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ 
  className = "", 
  size = "lg" 
}) => {
  const { isDarkMode } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: "w-24 h-24 sm:w-32 sm:h-32",
    md: "w-36 h-36 sm:w-40 sm:h-40",
    lg: "w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56",
    xl: "w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64"
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Hide the image and show placeholder instead
    setImageLoaded(false);
    setImageError(true);
  };

  const handlePhotoClick = () => {
    if (imageError) {
      // Show instructions or open file picker
      alert("Please add your profile photo to the 'public/profile-photo.jpg' file");
    }
  };

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        rotateY: 0,
        y: isHovered ? -8 : 0
      }}
      transition={{
        duration: 0.8,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
    >
      {/* Animated border/glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          background: isDarkMode 
            ? [
                "linear-gradient(45deg, rgba(255, 165, 0, 0.3), rgba(255, 165, 0, 0.1))",
                "linear-gradient(45deg, rgba(255, 165, 0, 0.6), rgba(255, 165, 0, 0.3))",
                "linear-gradient(45deg, rgba(255, 165, 0, 0.3), rgba(255, 165, 0, 0.1))"
              ]
            : [
                "linear-gradient(45deg, rgba(255, 165, 0, 0.2), rgba(255, 165, 0, 0.05))",
                "linear-gradient(45deg, rgba(255, 165, 0, 0.4), rgba(255, 165, 0, 0.2))",
                "linear-gradient(45deg, rgba(255, 165, 0, 0.2), rgba(255, 165, 0, 0.05))"
              ],
          boxShadow: isHovered
            ? [
                "0 0 20px rgba(255, 165, 0, 0.4)",
                "0 0 40px rgba(255, 165, 0, 0.6)",
                "0 0 20px rgba(255, 165, 0, 0.4)"
              ]
            : [
                "0 0 10px rgba(255, 165, 0, 0.2)",
                "0 0 20px rgba(255, 165, 0, 0.3)",
                "0 0 10px rgba(255, 165, 0, 0.2)"
              ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          padding: "3px",
          borderRadius: "50%"
        }}
      />

      {/* Main image container */}
      <motion.div
        className="relative w-full h-full rounded-full overflow-hidden"
        animate={{
          scale: isHovered ? 1.05 : 1,
          rotateY: isHovered ? 5 : 0
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
      >
              {/* Loading placeholder */}
      {!imageLoaded && (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center ${imageError ? 'cursor-pointer' : ''}`}
          initial={{ opacity: 1 }}
          animate={{ opacity: imageLoaded ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          onClick={handlePhotoClick}
        >
            <div className="text-center">
              {!imageError ? (
                <>
                  <motion.div
                    className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full mx-auto mb-3"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.p
                    className={`text-sm font-mono ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Loading...
                  </motion.p>
                </>
              ) : (
                <>
                  <motion.div
                    className="w-16 h-16 bg-orange-400/20 rounded-full mx-auto mb-3 flex items-center justify-center"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </motion.div>
                  <motion.p
                    className={`text-sm font-mono ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Add Photo
                  </motion.p>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Profile image */}
        <motion.img
          src="/profile-photo.jpg"
          alt="Akshay Juluri - Profile Photo"
          className="w-full h-full object-cover rounded-full"
          onLoad={() => setImageLoaded(true)}
          onError={handleImageError}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ 
            opacity: imageLoaded ? 1 : 0, 
            scale: imageLoaded ? 1 : 1.1 
          }}
          transition={{ duration: 0.5 }}
          whileHover={{
            scale: 1.1,
            filter: "brightness(1.1) contrast(1.05)"
          }}
        />

        {/* Hover overlay effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Floating particles effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          rotate: [0, 360]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full"
            style={{
              left: "50%",
              top: "50%",
              transform: `rotate(${i * 60}deg) translateY(-${size === "xl" ? "40" : size === "lg" ? "36" : size === "md" ? "32" : "28"}px)`
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ProfilePhoto; 