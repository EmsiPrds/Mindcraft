import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useUserStore } from "@/stores/user/useUserStore";
import { getTodaysChallengeApi } from "@/api/challenge/challenge.api";
import { getUserCurrentSkillPathApi } from "@/api/skillPath/skillPath.api";
import { getUserBadgesApi } from "@/api/badge/badge.api";
import { getUserAchievementsApi } from "@/api/achievement/achievement.api";
import type { TodaysChallengeType } from "@/types/challenge/challenge.type";
import { Trophy, Flame, Coins, TrendingUp, Target, Award, Star } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const { authUser } = useAuthStore();
  const { user, fetchUser } = useUserStore();
  const [todaysChallenge, setTodaysChallenge] = useState<TodaysChallengeType | null>(null);
  const [currentSkillPath, setCurrentSkillPath] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      await fetchUser();
      const [challenge, skillPath, userBadges, userAchievements] = await Promise.all([
        getTodaysChallengeApi().catch(() => null),
        getUserCurrentSkillPathApi().catch(() => null),
        getUserBadgesApi().catch(() => []),
        getUserAchievementsApi().catch(() => []),
      ]);
      setTodaysChallenge(challenge);
      setCurrentSkillPath(skillPath);
      setBadges(userBadges);
      setAchievements(userAchievements);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [fetchUser]);

  // Refresh data when component comes into focus (e.g., returning from challenge completion)
  useEffect(() => {
    const handleFocus = () => {
      loadDashboardData(false); // Don't show loading spinner on focus
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const getProgressToNextLevel = (currentXP: number, currentLevel: number): number => {
    // Simplified calculation
    const nextLevelXP = 100 * Math.pow(currentLevel, 1.5);
    const currentLevelXP = currentLevel > 1 ? 100 * Math.pow(currentLevel - 1, 1.5) : 0;
    const xpInCurrentLevel = currentXP - currentLevelXP;
    const xpNeededForNext = nextLevelXP - currentLevelXP;
    return xpNeededForNext > 0 ? Math.min(100, Math.floor((xpInCurrentLevel / xpNeededForNext) * 100)) : 100;
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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="w-full mb-6 sm:mb-8">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 minecraft-title">
            Welcome back, {authUser?.firstName}! 👋
          </h1>
          <p className="text-[#E8F5E9] text-base sm:text-lg md:text-xl">Ready to level up your skills today?</p>
        </div>

        {/* Stats Grid */}
        {user && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {/* XP Card */}
            <div className="minecraft-card bg-[#9C27B0] p-3 sm:p-4 md:p-5">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">{user.xp.toLocaleString()}</div>
              <div className="text-purple-100 text-sm sm:text-base mb-2 sm:mb-3">Total XP</div>
              <div className="minecraft-block bg-[#4A4A4A] h-3 overflow-hidden mb-2">
                <div
                  className="bg-[#FFD700] h-full transition-all"
                  style={{ width: `${getProgressToNextLevel(user.xp, user.level)}%` }}
                />
              </div>
              <div className="text-purple-100 text-sm sm:text-base font-bold">Level {user.level}</div>
            </div>

            {/* Streak Card */}
            <div className="minecraft-card bg-[#FF6B35] p-3 sm:p-4 md:p-5">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">{user.currentStreak}</div>
              <div className="text-orange-100 text-sm sm:text-base mb-2 sm:mb-3">Days Streak</div>
              <div className="text-orange-100 text-sm sm:text-base font-bold">Best: {user.longestStreak} days</div>
            </div>

            {/* Coins Card */}
            <div className="minecraft-card bg-[#FFD700] p-3 sm:p-4 md:p-5">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <Coins className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#1A1A1A]" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-1">{user.coins.toLocaleString()}</div>
              <div className="text-[#1A1A1A] text-sm sm:text-base font-bold">Total Coins</div>
            </div>

            {/* Challenges Card */}
            <div className="minecraft-card bg-[#4CAF50] p-3 sm:p-4 md:p-5">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">{user.completedChallenges}</div>
              <div className="text-green-100 text-sm sm:text-base font-bold">Completed</div>
            </div>
          </div>
        )}

        {/* Today's Challenge */}
        {todaysChallenge ? (
          <div className="minecraft-card bg-[#4A4A4A] p-4 sm:p-5 md:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-5 gap-3">
              <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2 minecraft-title">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#FFD700]" />
                Today's Challenge
              </h2>
              <div className="flex items-center gap-3">
                {todaysChallenge.hasSubmitted && (
                  <span className="minecraft-block bg-[#4CAF50] text-white px-4 py-2 text-base font-bold">
                    ✓ Completed
                  </span>
                )}
                <button
                  onClick={() => loadDashboardData(false)}
                  className="text-[#FFD700] hover:text-[#FFA500] transition text-2xl font-bold"
                  title="Refresh challenge"
                >
                  ↻
                </button>
              </div>
            </div>
            <div className="minecraft-card bg-[#7CB342] p-4 sm:p-5 md:p-6 mb-4">
              <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-2 minecraft-title">
                {typeof todaysChallenge.challenge.skillPathId === "object"
                  ? todaysChallenge.challenge.skillPathId.name
                  : "Challenge"}{" "}
                - Day {todaysChallenge.challenge.dayNumber}
              </h3>
              <p className="text-white mb-3 sm:mb-4 text-base sm:text-lg">{todaysChallenge.challenge.description}</p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-sm sm:text-base text-white font-bold">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-5 h-5" />
                  {todaysChallenge.challenge.xpReward} XP
                </span>
                <span className="flex items-center gap-1">
                  <Coins className="w-5 h-5" />
                  {todaysChallenge.challenge.coinReward} Coins
                </span>
                <span className="capitalize minecraft-block bg-white/20 px-3 py-1">
                  {todaysChallenge.challenge.difficulty}
                </span>
              </div>
            </div>
            <Link
              to={`/home/challenge/${todaysChallenge.challenge._id}`}
              className="block w-full minecraft-button bg-[#7CB342] hover:bg-[#689F38] text-white text-center font-bold px-4 py-3 sm:px-6 sm:py-4 text-base sm:text-lg md:text-xl"
            >
              {todaysChallenge.hasSubmitted ? "View Submission" : "Start Challenge →"}
            </Link>
          </div>
        ) : (
          <div className="minecraft-card bg-[#4A4A4A] p-4 sm:p-5 md:p-6 mb-6 sm:mb-8">
            <div className="text-center py-6 sm:py-8">
              <Target className="w-16 h-16 sm:w-20 sm:h-20 text-gray-500 mx-auto mb-3 sm:mb-4" />
              <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-2 minecraft-title">No Challenge Available</h2>
              <p className="text-gray-300 mb-4 sm:mb-6 text-base sm:text-lg">
                {!currentSkillPath?.skillPath
                  ? "Select a skill path to start receiving daily challenges!"
                  : "You've completed all challenges in this path. Try selecting a different skill path!"}
              </p>
              <Link
                to="/home/skill-paths"
                className="inline-block minecraft-button bg-[#7CB342] hover:bg-[#689F38] text-white px-4 py-2 sm:px-6 sm:py-3 font-bold text-base sm:text-lg md:text-xl"
              >
                {!currentSkillPath?.skillPath ? "Select Skill Path" : "Browse Other Paths"}
              </Link>
            </div>
          </div>
        )}

        {/* Current Skill Path */}
        {currentSkillPath?.skillPath && (
          <div className="minecraft-card bg-[#4A4A4A] p-4 sm:p-5 md:p-6 mb-6 sm:mb-8">
            <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-5 flex items-center gap-2 minecraft-title">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#FFD700]" />
              Current Skill Path
            </h2>
            <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-2 minecraft-title">
              {currentSkillPath.skillPath.name}
            </h3>
            <p className="text-gray-200 mb-4 sm:mb-5 text-base sm:text-lg">{currentSkillPath.skillPath.description}</p>
            {currentSkillPath.progress && (
              <div className="mb-4 sm:mb-5">
                <div className="flex items-center justify-between text-sm sm:text-base text-gray-200 mb-2 sm:mb-3 font-bold">
                  <span>
                    Day {currentSkillPath.progress.currentDay} of {currentSkillPath.progress.total}
                  </span>
                  <span className="text-[#7CB342]">
                    {currentSkillPath.progress.percentage}% Complete
                  </span>
                </div>
                <div className="minecraft-block bg-[#2A2A2A] h-3 sm:h-4 overflow-hidden">
                  <div
                    className="bg-[#7CB342] h-full transition-all"
                    style={{ width: `${currentSkillPath.progress.percentage}%` }}
                  />
                </div>
              </div>
            )}
            <Link
              to={`/home/skill-paths`}
              className="inline-block minecraft-button bg-[#87CEEB] hover:bg-[#6BB6E0] text-[#1A1A1A] px-4 py-2 sm:px-6 sm:py-3 font-bold text-base sm:text-lg md:text-xl"
            >
              View All Paths →
            </Link>
          </div>
        )}

        {/* Badges & Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Badges */}
          <div className="minecraft-card bg-[#4A4A4A] p-4 sm:p-5 md:p-6">
            <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-5 flex items-center gap-2 minecraft-title">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#9C27B0]" />
              Badges
              <span className="text-[#9C27B0] ml-2">({badges.length})</span>
            </h2>
            {badges.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
                {badges.slice(0, 6).map((badge) => (
                  <div
                    key={badge._id}
                    className="minecraft-block bg-[#5A5A5A] p-2 sm:p-3 md:p-4 text-center hover:bg-[#6A6A6A] transition"
                  >
                    <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">{badge.icon || "🏆"}</div>
                    <div className="text-white text-xs sm:text-sm font-bold truncate">{badge.name}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-300 text-base sm:text-lg mb-3 sm:mb-4">No badges yet. Complete challenges to earn badges!</p>
            )}
            <Link
              to="/home/badges"
              className="text-[#9C27B0] hover:text-[#7B1FA2] text-base sm:text-lg font-bold"
            >
              View All →
            </Link>
          </div>

          {/* Achievements */}
          <div className="minecraft-card bg-[#4A4A4A] p-4 sm:p-5 md:p-6">
            <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-5 flex items-center gap-2 minecraft-title">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#FFD700]" />
              Achievements
              <span className="text-[#FFD700] ml-2">({achievements.length})</span>
            </h2>
            {achievements.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
                {achievements.slice(0, 6).map((achievement) => (
                  <div
                    key={achievement._id}
                    className="minecraft-block bg-[#5A5A5A] p-2 sm:p-3 md:p-4 text-center hover:bg-[#6A6A6A] transition"
                  >
                    <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">{achievement.icon || "⭐"}</div>
                    <div className="text-white text-xs sm:text-sm font-bold truncate">{achievement.name}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-300 text-base sm:text-lg mb-3 sm:mb-4">
                No achievements yet. Keep learning to unlock achievements!
              </p>
            )}
            <Link
              to="/home/achievements"
              className="text-[#FFD700] hover:text-[#FFA500] text-base sm:text-lg font-bold"
            >
              View All →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <Link
            to="/home/challenges"
            className="minecraft-card bg-[#4A4A4A] p-4 sm:p-5 md:p-6 hover:bg-[#5A5A5A] transition"
          >
            <h3 className="text-white font-bold text-base sm:text-lg md:text-xl mb-2 minecraft-title">View Challenges</h3>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg">Browse all available challenges</p>
          </Link>
          <Link
            to="/home/portfolio"
            className="minecraft-card bg-[#4A4A4A] p-4 sm:p-5 md:p-6 hover:bg-[#5A5A5A] transition"
          >
            <h3 className="text-white font-bold text-base sm:text-lg md:text-xl mb-2 minecraft-title">My Portfolio</h3>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg">View your completed work</p>
          </Link>
          <Link
            to="/home/leaderboard"
            className="minecraft-card bg-[#4A4A4A] p-4 sm:p-5 md:p-6 hover:bg-[#5A5A5A] transition"
          >
            <h3 className="text-white font-bold text-base sm:text-lg md:text-xl mb-2 minecraft-title">Leaderboard</h3>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg">See how you rank</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
