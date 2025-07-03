import React, { useState, useEffect, useRef } from "react";
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
  Play,
} from "lucide-react";
import { getAnalyticsSummary, trackEvent, trackLocalPageView } from "../services/analytics";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { GeographiesProps, GeographyProps } from "react-simple-maps";

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
  locations: Array<{
    city?: string;
    country?: string;
    countryCode?: string;
    count: number;
  }>;
}

// Helper: get coordinates for a country/city (simple version)
const countryCentroids: Record<string, [number, number]> = {
  IN: [78.9629, 20.5937], // India
  US: [-98.5795, 39.8283], // USA
  // Add more as needed
};

// Optionally, you can use a geocoding API for more cities
function getCoordsForLocation(loc: { city?: string; countryCode?: string; country?: string }): [number, number] {
  if (loc.countryCode && countryCentroids[loc.countryCode]) {
    const val = countryCentroids[loc.countryCode];
    if (Array.isArray(val) && val.length === 2 && typeof val[0] === 'number' && typeof val[1] === 'number') {
      return [val[0], val[1]];
    }
  }
  return [0, 0];
}

const WorldMap: React.FC<{ locations: any[] }> = ({ locations }) => {
  const mapRef = useRef<any>(null);
  const [position, setPosition] = useState({ coordinates: [0, 20] as [number, number], zoom: 1 });

  const handleMoveEnd = (pos: { coordinates: [number, number]; zoom: number }) => {
    setPosition(pos);
  };

  const handleReset = () => {
    setPosition({ coordinates: [0, 20], zoom: 1 });
  };

  return (
    <div className="w-full h-96 mb-8 relative" style={{ pointerEvents: 'auto' }}>
      <button
        onClick={handleReset}
        className="absolute right-4 top-4 z-10 bg-gray-700 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
        title="Reset zoom"
      >
        Reset Zoom
      </button>
      <ComposableMap projectionConfig={{ scale: 120 }} width={800} height={350}>
        <ZoomableGroup
          center={position.coordinates}
          zoom={position.zoom}
          minZoom={1}
          maxZoom={8}
          onMoveEnd={handleMoveEnd}
        >
          <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#22223b"
                  stroke="#4a4e69"
                  style={{}}
                />
              ))
            }
          </Geographies>
          {locations.map((loc, i) => {
            const [lng, lat]: [number, number] = getCoordsForLocation(loc);
            if (lng === 0 && lat === 0) return null;
            // @ts-ignore
            return (
              <Marker key={i} coordinates={[lng, lat]}>
                <circle
                  r={6 + Math.log2(loc.count || 1) * 3}
                  fill="#fca311"
                  stroke="#fff"
                  strokeWidth={1}
                  fillOpacity={0.7}
                />
                <text
                  textAnchor="middle"
                  y={-12}
                  style={{ fontFamily: "monospace", fontSize: 10, fill: "#fff" }}
                >
                  {loc.city ? `${loc.city}, ` : ""}{loc.countryCode || loc.country}
                </text>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

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
            locations: [],
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

  // Test functions for debugging
  const testAnalytics = () => {
    console.log("Testing analytics tracking...");
    
    // Test various tracking functions
    trackEvent("test", "Debug", "dashboard_test");
    trackLocalPageView("/test");
    
    // Reload analytics data
    const realData = getAnalyticsSummary();
    setAnalytics(realData);
    
    alert("Test events sent! Check console for details.");
  };

  const clearAnalytics = () => {
    if (confirm("Are you sure you want to clear all analytics data?")) {
      localStorage.removeItem("portfolio_analytics");
      const realData = getAnalyticsSummary();
      setAnalytics(realData);
      alert("Analytics data cleared!");
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
            <div className="flex items-center gap-2">
              <button
                onClick={testAnalytics}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors flex items-center gap-1"
                title="Test analytics tracking"
              >
                <Play size={14} />
                Test
              </button>
              <button
                onClick={clearAnalytics}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                title="Clear analytics data"
              >
                Clear
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
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

                {/* Location Breakdown */}
                {analytics.locations && analytics.locations.length > 0 && (
                  <>
                    <WorldMap locations={analytics.locations} />
                    <div className="bg-gray-800 p-4 rounded-lg md:col-span-2">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Globe className="text-blue-400" size={20} />
                        Visitor Locations
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                          <thead>
                            <tr>
                              <th className="px-2 py-1 text-gray-400">#</th>
                              <th className="px-2 py-1 text-gray-400">City</th>
                              <th className="px-2 py-1 text-gray-400">Country</th>
                              <th className="px-2 py-1 text-gray-400">Code</th>
                              <th className="px-2 py-1 text-gray-400">Visitors</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analytics.locations.map((loc, i) => (
                              <tr key={i} className="border-b border-gray-700 last:border-0">
                                <td className="px-2 py-1 text-gray-300">{i + 1}</td>
                                <td className="px-2 py-1 text-gray-200">{loc.city || '-'}</td>
                                <td className="px-2 py-1 text-gray-200">{loc.country || '-'}</td>
                                <td className="px-2 py-1 text-gray-400">{loc.countryCode || '-'}</td>
                                <td className="px-2 py-1 text-orange-400 font-bold">{loc.count}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}

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
