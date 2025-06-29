import { useState, useEffect } from "react";

interface LocationInfo {
  city?: string;
  country?: string;
  timezone?: string;
  countryCode?: string;
}

interface GreetingData {
  timeGreeting: string;
  locationGreeting: string;
  emoji: string;
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  isWeekend: boolean;
  localTime: string;
  location: LocationInfo;
}

export const useDynamicGreeting = (): GreetingData => {
  const [greetingData, setGreetingData] = useState<GreetingData>(() => {
    const now = new Date();
    const hour = now.getHours();

    return {
      timeGreeting: getTimeGreeting(hour),
      locationGreeting: "Welcome to my portfolio!",
      emoji: getTimeEmoji(hour),
      timeOfDay: getTimeOfDay(hour),
      isWeekend: isWeekend(now),
      localTime: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      location: {},
    };
  });

  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date();
      const hour = now.getHours();

      setGreetingData((prev) => ({
        ...prev,
        timeGreeting: getTimeGreeting(hour),
        emoji: getTimeEmoji(hour),
        timeOfDay: getTimeOfDay(hour),
        isWeekend: isWeekend(now),
        localTime: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
    };

    // Update every minute
    const interval = setInterval(updateGreeting, 60000);

    // Get user's location for personalized greeting
    fetchLocationInfo();

    return () => clearInterval(interval);
  }, []);

  const fetchLocationInfo = async () => {
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch("https://ipapi.co/json/", {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const locationInfo: LocationInfo = {
          city: data.city,
          country: data.country_name,
          timezone: data.timezone,
          countryCode: data.country_code,
        };

        setGreetingData((prev) => ({
          ...prev,
          location: locationInfo,
          locationGreeting: generateLocationGreeting(locationInfo),
        }));
      }
    } catch (error) {
      // Silently fallback to timezone-based detection
      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const locationInfo: LocationInfo = {
          timezone: timezone,
        };

        setGreetingData((prev) => ({
          ...prev,
          location: locationInfo,
          locationGreeting: generateTimezoneGreeting(timezone),
        }));
      } catch (timezoneError) {
        // Use default greeting if all fails
        setGreetingData((prev) => ({
          ...prev,
          locationGreeting: "Welcome to my portfolio! 🚀",
        }));
      }
    }
  };

  return greetingData;
};

// Helper functions
function getTimeGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  } else if (hour >= 17 && hour < 22) {
    return "Good evening";
  } else {
    return "Good night";
  }
}

function getTimeEmoji(hour: number): string {
  if (hour >= 5 && hour < 12) {
    return "🌅";
  } else if (hour >= 12 && hour < 17) {
    return "☀️";
  } else if (hour >= 17 && hour < 22) {
    return "🌆";
  } else {
    return "🌙";
  }
}

function getTimeOfDay(
  hour: number
): "morning" | "afternoon" | "evening" | "night" {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 22) return "evening";
  return "night";
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
}

function generateLocationGreeting(location: LocationInfo): string {
  if (location.city && location.country) {
    return `Greetings from ${location.city}, ${location.country}! 🌍`;
  } else if (location.country) {
    return `Hello from ${location.country}! 🌍`;
  } else if (location.timezone) {
    return generateTimezoneGreeting(location.timezone);
  }
  return "Welcome to my portfolio! 🚀";
}

function generateTimezoneGreeting(timezone: string): string {
  const timezoneGreetings: { [key: string]: string } = {
    "America/New_York": "Hello from the East Coast! 🗽",
    "America/Los_Angeles": "Greetings from the West Coast! 🌴",
    "Europe/London": "Cheerio from the UK! 🇬🇧",
    "Europe/Paris": "Bonjour from Europe! 🇪🇺",
    "Asia/Tokyo": "Konnichiwa from Asia! 🌸",
    "Asia/Shanghai": "Ni Hao from Asia! 🏮",
    "Asia/Kolkata": "Namaste from India! 🇮🇳",
    "Australia/Sydney": "G'day from Down Under! 🦘",
  };

  return (
    timezoneGreetings[timezone] ||
    `Hello from ${timezone.split("/")[1]?.replace("_", " ")}! 🌍`
  );
}

export default useDynamicGreeting;
