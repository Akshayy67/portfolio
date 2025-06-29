import React from "react";
import { motion } from "framer-motion";

interface DynamicGreetingProps {
  className?: string;
  showDetails?: boolean;
}

const DynamicGreeting: React.FC<DynamicGreetingProps> = ({
  className = "",
  showDetails = false,
}) => {
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { text: "Good morning", emoji: "🌅" };
    if (hour >= 12 && hour < 17) return { text: "Good afternoon", emoji: "☀️" };
    if (hour >= 17 && hour < 22) return { text: "Good evening", emoji: "🌆" };
    return { text: "Good night", emoji: "🌙" };
  };

  const greeting = getTimeGreeting();

  return (
    <motion.div
      className={`text-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <p className="text-orange-400/80 font-mono text-sm">
        <span className="mr-1">{greeting.emoji}</span>
        {greeting.text}
      </p>
    </motion.div>
  );
};

export default DynamicGreeting;
