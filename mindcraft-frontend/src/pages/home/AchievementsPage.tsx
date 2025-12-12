import { useEffect, useState } from "react";
import { getUserAchievementsApi, getAllAchievementsApi } from "@/api/achievement/achievement.api";
import type { AchievementType } from "@/types/achievement/achievement.type";
import { Star, Trophy, Target, Flame, TrendingUp } from "lucide-react";
import { useUserStore } from "@/stores/user/useUserStore";

const AchievementsPage = () => {
  const { user } = useUserStore();
  const [userAchievements, setUserAchievements] = useState<AchievementType[]>([]);
  const [allAchievements, setAllAchievements] = useState<AchievementType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const [userAchievementsData, allAchievementsData] = await Promise.all([
          getUserAchievementsApi().catch(() => []),
          getAllAchievementsApi().catch(() => []),
        ]);
        setUserAchievements(userAchievementsData);
        setAllAchievements(allAchievementsData);
      } catch (error) {
        console.error("Error loading achievements:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAchievements();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "milestone":
        return <Trophy className="w-6 h-6" />;
      case "streak":
        return <Flame className="w-6 h-6" />;
      case "skill":
        return <Target className="w-6 h-6" />;
      case "community":
        return <Star className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "milestone":
        return "from-yellow-600 to-orange-600";
      case "streak":
        return "from-orange-600 to-red-600";
      case "skill":
        return "from-blue-600 to-cyan-600";
      case "community":
        return "from-purple-600 to-pink-600";
      default:
        return "from-gray-600 to-gray-700";
    }
  };

  const hasAchievement = (achievementId: string) => {
    return userAchievements.some((a) => a._id === achievementId);
  };

  const getProgress = (achievement: AchievementType) => {
    if (!user) return 0;
    
    switch (achievement.requirement.type) {
      case "complete_challenges":
        return Math.min(100, (user.completedChallenges / achievement.requirement.value) * 100);
      case "reach_level":
        return Math.min(100, (user.level / achievement.requirement.value) * 100);
      case "maintain_streak":
        return Math.min(100, (user.currentStreak / achievement.requirement.value) * 100);
      case "earn_xp":
        return Math.min(100, (user.xp / achievement.requirement.value) * 100);
      case "earn_coins":
        return Math.min(100, (user.coins / achievement.requirement.value) * 100);
      default:
        return 0;
    }
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
        <div className="mb-8">
          <h1 className="text-white text-4xl font-bold mb-2 flex items-center gap-3">
            <Star className="w-10 h-10 text-yellow-400" />
            Achievements
          </h1>
          <p className="text-purple-200">
            You've unlocked {userAchievements.length} of {allAchievements.length} achievements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allAchievements.map((achievement) => {
            const earned = hasAchievement(achievement._id);
            const progress = getProgress(achievement);
            
            return (
              <div
                key={achievement._id}
                className={`bg-gray-800 rounded-3xl p-6 border-2 shadow-2xl transition ${
                  earned
                    ? "border-yellow-500/50 bg-gradient-to-br from-gray-800 to-gray-800"
                    : "border-gray-700"
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getCategoryColor(
                      achievement.category
                    )} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}
                  >
                    {achievement.icon || "⭐"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-bold text-lg">{achievement.name}</h3>
                      {earned && (
                        <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{achievement.description}</p>
                    <div className="flex items-center gap-2 text-xs text-purple-400">
                      {getCategoryIcon(achievement.category)}
                      <span className="capitalize">{achievement.category}</span>
                    </div>
                  </div>
                </div>
                
                {!earned && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${getCategoryColor(achievement.category)} h-full transition-all rounded-full`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="mt-4 flex items-center gap-4 text-xs">
                  {achievement.xpReward > 0 && (
                    <span className="text-purple-400 font-semibold">
                      +{achievement.xpReward} XP
                    </span>
                  )}
                  {achievement.coinReward > 0 && (
                    <span className="text-yellow-400 font-semibold">
                      +{achievement.coinReward} Coins
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;

