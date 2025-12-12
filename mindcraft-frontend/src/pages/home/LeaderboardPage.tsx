import { useEffect, useState } from "react";
import { getGlobalLeaderboardXPApi, getUserGlobalRankApi } from "@/api/leaderboard/leaderboard.api";
import { Trophy, Medal, Award, Flame, TrendingUp } from "lucide-react";
import { useAuthStore } from "@/stores/auth/useAuthStore";

const LeaderboardPage = () => {
  const { authUser } = useAuthStore();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"xp" | "streak" | "level">("xp");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        let data, rank = null;
        
        // Always load public leaderboard data first
        if (sortBy === "xp") {
          data = await getGlobalLeaderboardXPApi({ limit: 100 });
        } else if (sortBy === "streak") {
          const { getGlobalLeaderboardStreakApi } = await import("@/api/leaderboard/leaderboard.api");
          data = await getGlobalLeaderboardStreakApi({ limit: 100 });
        } else {
          const { getGlobalLeaderboardLevelApi } = await import("@/api/leaderboard/leaderboard.api");
          data = await getGlobalLeaderboardLevelApi({ limit: 100 });
        }
        
        setLeaderboard(data.entries || []);
        
        // Only fetch user rank if authenticated (this is optional)
        if (authUser) {
          try {
            rank = await getUserGlobalRankApi(sortBy);
          } catch (rankError: any) {
            // User rank is optional - don't fail the whole page if it fails
            // Check if it's a 401 - that's expected if token is invalid
            if (rankError?.response?.status !== 401) {
              console.log("Could not fetch user rank:", rankError);
            }
            rank = null;
          }
        }
        
        setUserRank(rank);
      } catch (error: any) {
        console.error("Error loading leaderboard:", error);
        // Don't redirect on error - just show empty state
        // Only set empty if it's not a 401 (401 means we're not authenticated, which is fine for public leaderboard)
        if (error?.response?.status !== 401) {
          setLeaderboard([]);
          setUserRank(null);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [sortBy, authUser]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-400" />;
    return <span className="text-white/60 font-semibold">#{rank}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 overflow-y-scroll no-scrollbar pb-24">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-white text-4xl font-bold mb-6 flex items-center gap-3">
            <Trophy className="w-10 h-10 text-yellow-400" />
            Leaderboard
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setSortBy("xp")}
              className={`px-6 py-3 rounded-xl transition font-semibold ${
                sortBy === "xp"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              XP
            </button>
            <button
              onClick={() => setSortBy("streak")}
              className={`px-6 py-3 rounded-xl transition font-semibold ${
                sortBy === "streak"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
              }`}
            >
              <Flame className="w-4 h-4 inline mr-2" />
              Streak
            </button>
            <button
              onClick={() => setSortBy("level")}
              className={`px-6 py-3 rounded-xl transition font-semibold ${
                sortBy === "level"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
              }`}
            >
              <Award className="w-4 h-4 inline mr-2" />
              Level
            </button>
          </div>
        </div>

        {userRank && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 mb-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">Your Rank</p>
                <p className="text-white text-3xl font-bold">#{userRank.rank}</p>
              </div>
              <div className="text-right">
                <p className="text-purple-100 text-sm mb-1">Total XP</p>
                <p className="text-white text-2xl font-bold">
                  {userRank.user.stats.xp.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {leaderboard.map((entry) => (
            <div
              key={entry.user._id}
              className="bg-gray-800 rounded-2xl p-5 border border-gray-700 shadow-xl hover:border-purple-500/50 transition"
            >
              <div className="flex items-center gap-5">
                <div className="flex-shrink-0 w-14 flex items-center justify-center">
                  {getRankIcon(entry.rank)}
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold text-lg">
                    {entry.user.firstName} {entry.user.lastName}
                  </div>
                  <div className="text-gray-400 text-sm">@{entry.user.username}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-lg">{entry.stats.xp.toLocaleString()} XP</div>
                  <div className="text-gray-400 text-sm">Level {entry.stats.level}</div>
                </div>
                <div className="text-right">
                  <div className="text-orange-400 text-sm flex items-center gap-1 font-semibold">
                    <Flame className="w-4 h-4" />
                    {entry.stats.currentStreak}
                  </div>
                  <div className="text-gray-500 text-xs">{entry.stats.completedChallenges} done</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;

