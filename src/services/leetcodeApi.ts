// LeetCode Data Service
//
// Fetches live data from LeetCode API
// API Endpoint: https://leetcode-api-faisalshohag.vercel.app/akshayjuluri
//
// This approach ensures:
// ✅ Real-time data from LeetCode
// ✅ Automatic updates without manual intervention
// ✅ Accurate statistics

const LEETCODE_API_BASE = "https://leetcode-api-faisalshohag.vercel.app";
const LEETCODE_USERNAME = "akshayjuluri";
const LEETCODE_PROFILE_URL = "https://leetcode.com/u/akshayjuluri/";

export interface LeetCodeProfile {
  username: string;
  name: string;
  ranking: number;
  profileUrl: string;
}

export interface LeetCodeSolved {
  solvedProblem: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSubmissions: number;
  acceptanceRate: number;
}

export interface LeetCodeContest {
  contestRating: number;
  contestGlobalRanking: number;
  contestAttend: number;
  contestTopPercentage: number;
  maxRating: number;
}

export interface LeetCodeBadge {
  name: string;
  icon: string;
}

export interface LeetCodeActivity {
  lastSolved: string;
  lastSolvedDate: string;
  currentStreak: number;
  maxStreak: number;
}

export interface LeetCodeSkill {
  name: string;
  level: string;
}

export interface LeetCodeStats {
  profile: LeetCodeProfile;
  solved: LeetCodeSolved;
  contest: LeetCodeContest;
  badges: LeetCodeBadge[];
  recentActivity: LeetCodeActivity;
  skills: LeetCodeSkill[];
  lastUpdated: number;
}

// Fetch data from LeetCode API
const fetchLeetCodeData = async (username: string): Promise<any> => {
  try {
    const response = await fetch(`${LEETCODE_API_BASE}/${username}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch LeetCode data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching LeetCode data:", error);
    throw error;
  }
};

// Get user profile data
export const fetchLeetCodeProfile = async (
  username: string
): Promise<LeetCodeProfile> => {
  const data = await fetchLeetCodeData(username);
  return {
    username: username,
    name: data.name || "Akshay Juluri",
    ranking: data.ranking || 0,
    profileUrl: LEETCODE_PROFILE_URL,
  };
};

// Get solved problems statistics
export const fetchLeetCodeSolved = async (
  username: string
): Promise<LeetCodeSolved> => {
  const data = await fetchLeetCodeData(username);
  return {
    solvedProblem: data.totalSolved || 0,
    easySolved: data.easySolved || 0,
    mediumSolved: data.mediumSolved || 0,
    hardSolved: data.hardSolved || 0,
    totalSubmissions: data.totalSubmissions?.[0]?.submissions || 0,
    acceptanceRate: data.acceptanceRate || 0,
  };
};

// Get contest statistics
export const fetchLeetCodeContest = async (
  username: string
): Promise<LeetCodeContest> => {
  const data = await fetchLeetCodeData(username);
  return {
    contestRating: Math.round(data.contestRating || 0),
    contestGlobalRanking: data.contestGlobalRanking || 0,
    contestAttend: data.contestAttend || 0,
    contestTopPercentage: data.contestTopPercentage || 0,
    maxRating: Math.round(data.contestRating || 0),
  };
};

// Get user badges
export const fetchLeetCodeBadges = async (
  username: string
): Promise<LeetCodeBadge[]> => {
  const data = await fetchLeetCodeData(username);
  const badges: LeetCodeBadge[] = [];

  if (data.badges && Array.isArray(data.badges)) {
    data.badges.forEach((badge: any) => {
      badges.push({
        name: badge.displayName || badge.name || "Badge",
        icon: "🏆",
      });
    });
  }

  return badges;
};

// Get complete LeetCode statistics
export const fetchLeetCodeStats = async (
  username: string
): Promise<LeetCodeStats> => {
  try {
    const data = await fetchLeetCodeData(username);
    const [profile, solved, contest, badges] = await Promise.allSettled([
      fetchLeetCodeProfile(username),
      fetchLeetCodeSolved(username),
      fetchLeetCodeContest(username),
      fetchLeetCodeBadges(username),
    ]);

    const stats: LeetCodeStats = {
      profile:
        profile.status === "fulfilled"
          ? profile.value
          : ({} as LeetCodeProfile),
      solved:
        solved.status === "fulfilled" ? solved.value : ({} as LeetCodeSolved),
      contest:
        contest.status === "fulfilled"
          ? contest.value
          : ({} as LeetCodeContest),
      badges: badges.status === "fulfilled" ? badges.value : [],
      recentActivity: {
        lastSolved: data.recentSubmissions?.[0]?.title || "N/A",
        lastSolvedDate: data.recentSubmissions?.[0]?.timestamp
          ? new Date(data.recentSubmissions[0].timestamp * 1000)
              .toISOString()
              .split("T")[0]
          : "N/A",
        currentStreak: 0, // API doesn't provide streak data
        maxStreak: 0,
      },
      skills: [], // API doesn't provide skills data
      lastUpdated: Date.now(),
    };

    return stats;
  } catch (error) {
    console.error("Error fetching complete LeetCode stats:", error);
    throw error;
  }
};

// Calculate global ranking percentage
export const calculateGlobalRankingPercentage = (
  ranking: number,
  totalUsers: number = 1000000
): number => {
  if (!ranking || ranking <= 0) return 0;
  return Math.round(((totalUsers - ranking) / totalUsers) * 100 * 100) / 100;
};

// Format large numbers
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

// Get difficulty color
export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "#00b8a3";
    case "medium":
      return "#ffc01e";
    case "hard":
      return "#ff375f";
    default:
      return "#8b8b8b";
  }
};
