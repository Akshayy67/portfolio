import ReactGA from "react-ga4";

// Analytics configuration
const TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || "G-5FRYGYCJ20";
const DEBUG = import.meta.env.DEV;

// Debug function to check GA setup
const debugAnalytics = () => {
  console.log("=== Analytics Debug Info ===");
  console.log("Environment:", import.meta.env.MODE);
  console.log("Tracking ID:", TRACKING_ID);
  console.log("Debug Mode:", DEBUG);
  console.log("Window Location:", typeof window !== "undefined" ? window.location.href : "SSR");
  console.log("User Agent:", typeof navigator !== "undefined" ? navigator.userAgent : "SSR");
  console.log("Gtag Available:", typeof window !== "undefined" && typeof (window as any).gtag !== "undefined");
  console.log("===========================");
};

// Initialize Google Analytics
export const initGA = () => {
  try {
    debugAnalytics();
    
    // Only initialize if we have a valid tracking ID
    if (!TRACKING_ID || TRACKING_ID === "G-XXXXXXXXXX") {
      console.warn("Invalid or missing Google Analytics tracking ID");
      return;
    }

    console.log("Initializing Google Analytics with ID:", TRACKING_ID);
    
    // Initialize React GA4
    ReactGA.initialize(TRACKING_ID, {
      testMode: DEBUG,
      gtagOptions: {
        debug_mode: DEBUG,
      },
    });
    
    console.log("Google Analytics initialized successfully");
    
    // Send a test pageview to verify tracking
    if (typeof window !== "undefined") {
      // Use both React GA4 and gtag for maximum compatibility
      ReactGA.send({
        hitType: "pageview",
        page: window.location.pathname,
        title: document.title,
      });
      
      // Also send via gtag if available
      if (typeof (window as any).gtag !== "undefined") {
        (window as any).gtag('config', TRACKING_ID, {
          page_path: window.location.pathname,
          page_title: document.title,
        });
      }
      
      console.log("Test pageview sent to GA");
    }
  } catch (error) {
    console.error("Failed to initialize Google Analytics:", error);
  }
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  try {
    console.log("Tracking page view:", path);
    
    // Use React GA4
    ReactGA.send({
      hitType: "pageview",
      page: path,
      title: title || document.title,
    });
    
    // Also use gtag if available
    if (typeof window !== "undefined" && typeof (window as any).gtag !== "undefined") {
      (window as any).gtag('config', TRACKING_ID, {
        page_path: path,
        page_title: title || document.title,
      });
    }
  } catch (error) {
    console.error("Failed to track page view:", error);
  }
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  try {
    console.log("Tracking event:", { action, category, label, value });
    
    // Use React GA4
    ReactGA.event({
      action,
      category,
      label,
      value,
    });
    
    // Also use gtag if available
    if (typeof window !== "undefined" && typeof (window as any).gtag !== "undefined") {
      (window as any).gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  } catch (error) {
    console.error("Failed to track event:", error);
  }
};

// Track user interactions
export const trackUserInteraction = (element: string, action: string) => {
  trackEvent(action, "User Interaction", element);
};

// Track section views (for portfolio sections)
export const trackSectionView = (section: string) => {
  trackEvent("view", "Section", section);
};

// Track contact form submissions
export const trackContactForm = (method: string) => {
  trackEvent("submit", "Contact Form", method);
};

// Track voice commands
export const trackVoiceCommand = (command: string) => {
  trackEvent("voice_command", "Voice Navigation", command);
};

// Track theme changes
export const trackThemeChange = (theme: string) => {
  trackEvent("theme_change", "UI", theme);
};

// Track project clicks
export const trackProjectClick = (projectName: string) => {
  trackEvent("click", "Project", projectName);
};

// Local storage analytics (for offline tracking)
interface LocalAnalytics {
  pageViews: { [key: string]: number };
  events: Array<{
    timestamp: number;
    type: string;
    data: any;
  }>;
  sessions: Array<{
    start: number;
    end?: number;
    pages: string[];
  }>;
}

const ANALYTICS_KEY = "portfolio_analytics";

export const getLocalAnalytics = (): LocalAnalytics => {
  try {
    if (typeof localStorage === "undefined") {
      return {
        pageViews: {},
        events: [],
        sessions: [],
      };
    }
    const stored = localStorage.getItem(ANALYTICS_KEY);
    return stored
      ? JSON.parse(stored)
      : {
          pageViews: {},
          events: [],
          sessions: [],
        };
  } catch {
    return {
      pageViews: {},
      events: [],
      sessions: [],
    };
  }
};

export const updateLocalAnalytics = (update: Partial<LocalAnalytics>) => {
  try {
    if (typeof localStorage === "undefined") {
      return;
    }
    const current = getLocalAnalytics();
    const updated = { ...current, ...update };
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn("Failed to update local analytics:", error);
  }
};

// Track page view locally
export const trackLocalPageView = (path: string) => {
  try {
    console.log("Tracking local page view:", path);
    const analytics = getLocalAnalytics();
    analytics.pageViews[path] = (analytics.pageViews[path] || 0) + 1;
    analytics.events.push({
      timestamp: Date.now(),
      type: "pageview",
      data: { path },
    });
    updateLocalAnalytics(analytics);
    console.log("Local page view tracked successfully");
  } catch (error) {
    console.error("Failed to track local page view:", error);
  }
};

// Start a new session
export const startSession = () => {
  try {
    if (typeof window === "undefined") {
      return;
    }
    console.log("Starting new analytics session");
    const analytics = getLocalAnalytics();
    const newSession = {
      start: Date.now(),
      pages: [window.location.pathname],
    };
    analytics.sessions.push(newSession);
    updateLocalAnalytics(analytics);
    console.log("Session started successfully");
  } catch (error) {
    console.error("Failed to start session:", error);
  }
};

// End current session
export const endSession = () => {
  try {
    console.log("Ending analytics session");
    const analytics = getLocalAnalytics();
    const currentSession = analytics.sessions[analytics.sessions.length - 1];
    if (currentSession && !currentSession.end) {
      currentSession.end = Date.now();
      updateLocalAnalytics(analytics);
      console.log("Session ended successfully");
    }
  } catch (error) {
    console.error("Failed to end session:", error);
  }
};

// Get analytics summary
export const getAnalyticsSummary = () => {
  const analytics = getLocalAnalytics();
  const now = Date.now();
  const today = new Date().toDateString();

  // Calculate today's events
  const todayEvents = analytics.events.filter(
    (event) => new Date(event.timestamp).toDateString() === today
  );

  // Calculate total page views
  const totalPageViews = Object.values(analytics.pageViews).reduce(
    (sum, views) => sum + views,
    0
  );

  // Calculate average session time
  const completedSessions = analytics.sessions.filter((s) => s.end);
  const avgSessionTime =
    completedSessions.length > 0
      ? completedSessions.reduce((sum, s) => sum + (s.end! - s.start), 0) /
        completedSessions.length
      : 0;

  // Get top pages
  const topPages = Object.entries(analytics.pageViews)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([page, views]) => ({ page: page.replace("/", "") || "Home", views }));

  return {
    totalVisitors: analytics.sessions.length,
    todayVisitors: todayEvents.filter((e) => e.type === "pageview").length,
    pageViews: totalPageViews,
    avgTimeOnSite: formatTime(avgSessionTime),
    topPages,
    recentEvents: analytics.events.slice(-10).reverse(),
  };
};

// Format time duration
const formatTime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};
