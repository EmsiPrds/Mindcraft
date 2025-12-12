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
      <div className="min-h-screen w-full minecraft-bg flex items-center justify-center">
        <div className="text-white text-3xl font-bold minecraft-title">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full minecraft-bg overflow-y-scroll no-scrollbar pb-20 sm:pb-24">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 minecraft-title">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#FFD700]" />
            Leaderboard
          </h1>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setSortBy("xp")}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 minecraft-button transition font-bold text-sm sm:text-base md:text-lg ${
                sortBy === "xp"
                  ? "bg-[#7CB342] text-white"
                  : "bg-[#4A4A4A] text-gray-300 hover:bg-[#5A5A5A]"
              }`}
            >
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
              XP
            </button>
            <button
              onClick={() => setSortBy("streak")}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 minecraft-button transition font-bold text-sm sm:text-base md:text-lg ${
                sortBy === "streak"
                  ? "bg-[#FF6B35] text-white"
                  : "bg-[#4A4A4A] text-gray-300 hover:bg-[#5A5A5A]"
              }`}
            >
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
              Streak
            </button>
            <button
              onClick={() => setSortBy("level")}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 minecraft-button transition font-bold text-sm sm:text-base md:text-lg ${
                sortBy === "level"
                  ? "bg-[#FFD700] text-[#1A1A1A]"
                  : "bg-[#4A4A4A] text-gray-300 hover:bg-[#5A5A5A]"
              }`}
            >
              <Award className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
              Level
            </button>
          </div>
        </div>

        {userRank && (
          <div className="minecraft-card bg-[#7CB342] p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[#E8F5E9] text-sm sm:text-base md:text-lg mb-1 font-bold">Your Rank</p>
                <p className="text-white text-2xl sm:text-3xl md:text-4xl font-bold minecraft-title">#{userRank.rank}</p>
              </div>
              <div className="text-right">
                <p className="text-[#E8F5E9] text-sm sm:text-base md:text-lg mb-1 font-bold">Total XP</p>
                <p className="text-white text-xl sm:text-2xl md:text-3xl font-bold minecraft-title">
                  {userRank.user.stats.xp.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2 sm:space-y-3">
          {leaderboard.map((entry) => (
            <div
              key={entry.user._id}
              className="minecraft-card bg-[#4A4A4A] p-3 sm:p-4 md:p-5 hover:bg-[#5A5A5A] transition"
            >
              <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
                <div className="flex-shrink-0 w-10 sm:w-12 md:w-16 flex items-center justify-center">
                  {getRankIcon(entry.rank)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold text-sm sm:text-base md:text-xl minecraft-title truncate">
                    {entry.user.firstName} {entry.user.lastName}
                  </div>
                  <div className="text-gray-300 text-xs sm:text-sm md:text-lg truncate">@{entry.user.username}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-white font-bold text-sm sm:text-base md:text-xl">{entry.stats.xp.toLocaleString()} XP</div>
                  <div className="text-gray-300 text-xs sm:text-sm md:text-lg">Level {entry.stats.level}</div>
                </div>
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <div className="text-[#FF6B35] text-sm sm:text-base md:text-lg flex items-center gap-1 font-bold">
                    <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
                    {entry.stats.currentStreak}
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm md:text-base">{entry.stats.completedChallenges} done</div>
                </div>
              </div>
              <div className="sm:hidden mt-2 pt-2 border-t-2 border-[#1A1A1A] flex items-center justify-between">
                <div className="text-[#FF6B35] text-sm flex items-center gap-1 font-bold">
                  <Flame className="w-4 h-4" />
                  {entry.stats.currentStreak} streak
                </div>
                <div className="text-gray-400 text-sm">{entry.stats.completedChallenges} done</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;

