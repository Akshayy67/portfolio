import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface DynamicGreetingProps {
  className?: string;
  showDetails?: boolean;
}

// Map Open-Meteo weather codes to emojis
const weatherCodeToEmoji = (code: number): string => {
  if ([0, 1].includes(code)) return "☀️"; // Clear
  if ([2, 3].includes(code)) return "⛅"; // Partly/mostly cloudy
  if ([45, 48].includes(code)) return "🌫️"; // Fog
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️"; // Drizzle/Rain
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️"; // Snow
  if ([95, 96, 99].includes(code)) return "⛈️"; // Thunderstorm
  if ([4].includes(code)) return "🌬️"; // Windy
  return "🌎"; // Fallback
};

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 22) return "Good evening";
  return "Good night";
};

const DynamicGreeting: React.FC<DynamicGreetingProps> = ({
  className = "",
  showDetails = false,
}) => {
  const [weatherEmoji, setWeatherEmoji] = useState("🌎");

  useEffect(() => {
    // Step 1: Get user location
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((loc) => {
        if (loc && loc.latitude && loc.longitude) {
          // Step 2: Get weather for location
          fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current_weather=true`
          )
            .then((res) => res.json())
            .then((weather) => {
              const code = weather?.current_weather?.weathercode;
              setWeatherEmoji(weatherCodeToEmoji(code));
            })
            .catch(() => setWeatherEmoji("🌎"));
        } else {
          setWeatherEmoji("🌎");
        }
      })
      .catch(() => setWeatherEmoji("🌎"));
  }, []);

  const greeting = getTimeGreeting();

  return (
    <motion.div
      className={`text-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <p className="text-orange-400/80 font-mono text-sm">
        <span className="mr-1">{weatherEmoji}</span>
        {greeting}
      </p>
    </motion.div>
  );
};

export default DynamicGreeting;
