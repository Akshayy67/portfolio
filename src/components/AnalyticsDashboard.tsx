import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Users,
  Eye,
  MapPin,
  Clock,
  X,
  TrendingUp,
  Activity,
  Globe,
} from "lucide-react";
import { getAnalyticsSummary } from "../services/analytics";

interface AnalyticsData {
  totalVisitors: number;
  todayVisitors: number;
  pageViews: number;
  avgTimeOnSite: string;
  topPages: { page: string; views: number }[];
  recentEvents: Array<{
    timestamp: number;
    type: string;
    data: any;
  }>;
}

const AnalyticsDashboard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  // Secret key combination to show dashboard (Ctrl + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        setIsVisible(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Load real analytics data
  useEffect(() => {
    if (isAuthenticated) {
      const loadAnalytics = () => {
        try {
          const realData = getAnalyticsSummary();
          setAnalytics(realData);
        } catch (error) {
          console.error("Failed to load analytics:", error);
          // Fallback to basic data
          setAnalytics({
            totalVisitors: 0,
            todayVisitors: 0,
            pageViews: 0,
            avgTimeOnSite: "0m 0s",
            topPages: [],
            recentEvents: [],
          });
        }
      };

      loadAnalytics();

      // Refresh analytics every 30 seconds
      const interval = setInterval(loadAnalytics, 30000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleAuth = () => {
    // Simple password check (replace with proper auth)
    if (password === "akshay2024") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid password");
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsVisible(false)}
      >
        <motion.div
          className="bg-gray-900 rounded-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="text-orange-400" />
              Analytics Dashboard
            </h2>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {!isAuthenticated ? (
            /* Authentication */
            <div className="text-center">
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-orange-400 outline-none"
                  onKeyPress={(e) => e.key === "Enter" && handleAuth()}
                />
              </div>
              <button
                onClick={handleAuth}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Access Dashboard
              </button>
              <p className="text-gray-400 text-sm mt-2">
                Hint: Press Ctrl + Shift + A to open
              </p>
            </div>
          ) : (
            /* Dashboard Content */
            analytics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Stats Cards */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="text-orange-400" size={20} />
                    <span className="text-gray-300">Total Visitors</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {analytics.totalVisitors}
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="text-green-400" size={20} />
                    <span className="text-gray-300">Today</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {analytics.todayVisitors}
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="text-blue-400" size={20} />
                    <span className="text-gray-300">Page Views</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {analytics.pageViews}
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="text-purple-400" size={20} />
                    <span className="text-gray-300">Avg Time</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {analytics.avgTimeOnSite}
                  </div>
                </div>

                {/* Top Pages */}
                <div className="bg-gray-800 p-4 rounded-lg md:col-span-2">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Top Pages
                  </h3>
                  <div className="space-y-2">
                    {analytics.topPages.map((page, index) => (
                      <div
                        key={page.page}
                        className="flex justify-between items-center"
                      >
                        <span className="text-gray-300">{page.page}</span>
                        <span className="text-orange-400 font-semibold">
                          {page.views}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-800 p-4 rounded-lg md:col-span-2">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Activity className="text-orange-400" size={20} />
                    Recent Activity
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {analytics.recentEvents.length > 0 ? (
                      analytics.recentEvents.map((event, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-300">
                            {event.type === "pageview"
                              ? "👁️ Page View"
                              : event.type === "voice_command"
                              ? "🎤 Voice Command"
                              : event.type === "theme_change"
                              ? "🎨 Theme Change"
                              : event.type === "click"
                              ? "👆 Click"
                              : "📊 Event"}
                            {event.data?.path && ` - ${event.data.path}`}
                            {event.data?.command && ` - ${event.data.command}`}
                            {event.data?.theme && ` - ${event.data.theme}`}
                          </span>
                          <span className="text-orange-400 text-xs">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400 text-sm">
                        No recent activity. Start browsing to see real-time
                        data!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnalyticsDashboard;
