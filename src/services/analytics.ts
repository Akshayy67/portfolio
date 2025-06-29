import ReactGA from "react-ga4";

// Analytics configuration
const TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || "G-XXXXXXXXXX"; // Replace with your Google Analytics 4 tracking ID
const DEBUG = import.meta.env.DEV;

// Initialize Google Analytics
export const initGA = () => {
  ReactGA.initialize(TRACKING_ID, {
    testMode: DEBUG,
    gtagOptions: {
      debug_mode: DEBUG,
    },
  });
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  ReactGA.send({
    hitType: "pageview",
    page: path,
    title: title || document.title,
  });
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  ReactGA.event({
    action,
    category,
    label,
    value,
  });
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
  const analytics = getLocalAnalytics();
  analytics.pageViews[path] = (analytics.pageViews[path] || 0) + 1;
  analytics.events.push({
    timestamp: Date.now(),
    type: "pageview",
    data: { path },
  });
  updateLocalAnalytics(analytics);
};

// Start a new session
export const startSession = () => {
  if (typeof window === "undefined") {
    return;
  }
  const analytics = getLocalAnalytics();
  const newSession = {
    start: Date.now(),
    pages: [window.location.pathname],
  };
  analytics.sessions.push(newSession);
  updateLocalAnalytics(analytics);
};

// End current session
export const endSession = () => {
  const analytics = getLocalAnalytics();
  const currentSession = analytics.sessions[analytics.sessions.length - 1];
  if (currentSession && !currentSession.end) {
    currentSession.end = Date.now();
    updateLocalAnalytics(analytics);
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
