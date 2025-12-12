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
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 overflow-y-scroll no-scrollbar pb-24">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="w-full mb-8">
          <h1 className="text-white text-3xl font-bold mb-1">
            Welcome back, {authUser?.firstName}! 👋
          </h1>
          <p className="text-purple-200 text-sm">Ready to level up your skills today?</p>
        </div>

        {/* Stats Grid */}
        {user && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* XP Card */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{user.xp.toLocaleString()}</div>
              <div className="text-purple-100 text-xs mb-3">Total XP</div>
              <div className="bg-white/20 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-white h-full transition-all rounded-full"
                  style={{ width: `${getProgressToNextLevel(user.xp, user.level)}%` }}
                />
              </div>
              <div className="text-purple-100 text-xs mt-2">Level {user.level}</div>
            </div>

            {/* Streak Card */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{user.currentStreak}</div>
              <div className="text-orange-100 text-xs mb-3">Days Streak</div>
              <div className="text-orange-100 text-xs">Best: {user.longestStreak} days</div>
            </div>

            {/* Coins Card */}
            <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{user.coins.toLocaleString()}</div>
              <div className="text-yellow-100 text-xs">Total Coins</div>
            </div>

            {/* Challenges Card */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{user.completedChallenges}</div>
              <div className="text-green-100 text-xs">Completed</div>
            </div>
          </div>
        )}

        {/* Today's Challenge */}
        {todaysChallenge ? (
          <div className="bg-gray-800 rounded-3xl p-6 mb-8 shadow-2xl border border-purple-500/20">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white text-2xl font-bold flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400" />
                Today's Challenge
              </h2>
              <div className="flex items-center gap-3">
                {todaysChallenge.hasSubmitted && (
                  <span className="bg-green-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                    ✓ Completed
                  </span>
                )}
                <button
                  onClick={() => loadDashboardData(false)}
                  className="text-purple-300 hover:text-purple-200 transition text-xl"
                  title="Refresh challenge"
                >
                  ↻
                </button>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 mb-4">
              <h3 className="text-white text-xl font-bold mb-2">
                {typeof todaysChallenge.challenge.skillPathId === "object"
                  ? todaysChallenge.challenge.skillPathId.name
                  : "Challenge"}{" "}
                - Day {todaysChallenge.challenge.dayNumber}
              </h3>
              <p className="text-white/90 mb-4">{todaysChallenge.challenge.description}</p>
              <div className="flex items-center gap-6 text-sm text-white/80">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {todaysChallenge.challenge.xpReward} XP
                </span>
                <span className="flex items-center gap-1">
                  <Coins className="w-4 h-4" />
                  {todaysChallenge.challenge.coinReward} Coins
                </span>
                <span className="capitalize bg-white/20 px-3 py-1 rounded-full">
                  {todaysChallenge.challenge.difficulty}
                </span>
              </div>
            </div>
            <Link
              to={`/home/challenge/${todaysChallenge.challenge._id}`}
              className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center font-semibold px-6 py-4 rounded-xl transition shadow-lg"
            >
              {todaysChallenge.hasSubmitted ? "View Submission" : "Start Challenge →"}
            </Link>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-3xl p-6 mb-8 shadow-2xl border border-purple-500/20">
            <div className="text-center py-8">
              <Target className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h2 className="text-white text-2xl font-bold mb-2">No Challenge Available</h2>
              <p className="text-gray-400 mb-6">
                {!currentSkillPath?.skillPath
                  ? "Select a skill path to start receiving daily challenges!"
                  : "You've completed all challenges in this path. Try selecting a different skill path!"}
              </p>
              <Link
                to="/home/skill-paths"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                {!currentSkillPath?.skillPath ? "Select Skill Path" : "Browse Other Paths"}
              </Link>
            </div>
          </div>
        )}

        {/* Current Skill Path */}
        {currentSkillPath?.skillPath && (
          <div className="bg-gray-800 rounded-3xl p-6 mb-8 shadow-2xl border border-blue-500/20">
            <h2 className="text-white text-2xl font-bold mb-5 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Current Skill Path
            </h2>
            <h3 className="text-white text-xl font-bold mb-2">
              {currentSkillPath.skillPath.name}
            </h3>
            <p className="text-gray-300 mb-5">{currentSkillPath.skillPath.description}</p>
            {currentSkillPath.progress && (
              <div className="mb-5">
                <div className="flex items-center justify-between text-sm text-gray-300 mb-3">
                  <span className="font-semibold">
                    Day {currentSkillPath.progress.currentDay} of {currentSkillPath.progress.total}
                  </span>
                  <span className="font-semibold text-purple-400">
                    {currentSkillPath.progress.percentage}% Complete
                  </span>
                </div>
                <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all rounded-full"
                    style={{ width: `${currentSkillPath.progress.percentage}%` }}
                  />
                </div>
              </div>
            )}
            <Link
              to={`/home/skill-paths`}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition font-semibold"
            >
              View All Paths →
            </Link>
          </div>
        )}

        {/* Badges & Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Badges */}
          <div className="bg-gray-800 rounded-3xl p-6 shadow-2xl border border-purple-500/20">
            <h2 className="text-white text-xl font-bold mb-5 flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-400" />
              Badges
              <span className="text-purple-400 ml-2">({badges.length})</span>
            </h2>
            {badges.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 mb-4">
                {badges.slice(0, 6).map((badge) => (
                  <div
                    key={badge._id}
                    className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl p-4 text-center border border-purple-500/30 hover:border-purple-400 transition"
                  >
                    <div className="text-3xl mb-2">{badge.icon || "🏆"}</div>
                    <div className="text-white text-xs font-medium truncate">{badge.name}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm mb-4">No badges yet. Complete challenges to earn badges!</p>
            )}
            <Link
              to="/home/badges"
              className="text-purple-400 hover:text-purple-300 text-sm font-semibold"
            >
              View All →
            </Link>
          </div>

          {/* Achievements */}
          <div className="bg-gray-800 rounded-3xl p-6 shadow-2xl border border-yellow-500/20">
            <h2 className="text-white text-xl font-bold mb-5 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400" />
              Achievements
              <span className="text-yellow-400 ml-2">({achievements.length})</span>
            </h2>
            {achievements.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 mb-4">
                {achievements.slice(0, 6).map((achievement) => (
                  <div
                    key={achievement._id}
                    className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-xl p-4 text-center border border-yellow-500/30 hover:border-yellow-400 transition"
                  >
                    <div className="text-3xl mb-2">{achievement.icon || "⭐"}</div>
                    <div className="text-white text-xs font-medium truncate">{achievement.name}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm mb-4">
                No achievements yet. Keep learning to unlock achievements!
              </p>
            )}
            <Link
              to="/home/achievements"
              className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold"
            >
              View All →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/home/challenges"
            className="bg-gray-800 rounded-2xl p-6 border border-blue-500/20 shadow-xl hover:bg-gray-750 hover:border-blue-400/40 transition"
          >
            <h3 className="text-white font-bold text-lg mb-2">View Challenges</h3>
            <p className="text-gray-400 text-sm">Browse all available challenges</p>
          </Link>
          <Link
            to="/home/portfolio"
            className="bg-gray-800 rounded-2xl p-6 border border-purple-500/20 shadow-xl hover:bg-gray-750 hover:border-purple-400/40 transition"
          >
            <h3 className="text-white font-bold text-lg mb-2">My Portfolio</h3>
            <p className="text-gray-400 text-sm">View your completed work</p>
          </Link>
          <Link
            to="/home/leaderboard"
            className="bg-gray-800 rounded-2xl p-6 border border-yellow-500/20 shadow-xl hover:bg-gray-750 hover:border-yellow-400/40 transition"
          >
            <h3 className="text-white font-bold text-lg mb-2">Leaderboard</h3>
            <p className="text-gray-400 text-sm">See how you rank</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
