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
      <div className="min-h-screen w-full minecraft-bg flex items-center justify-center">
        <div className="text-white text-3xl font-bold minecraft-title">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full minecraft-bg overflow-y-scroll no-scrollbar pb-20 sm:pb-24">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3 minecraft-title">
            <Star className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#FFD700]" />
            Achievements
          </h1>
          <p className="text-[#E8F5E9] text-lg sm:text-xl md:text-2xl">
            You've unlocked {userAchievements.length} of {allAchievements.length} achievements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {allAchievements.map((achievement) => {
            const earned = hasAchievement(achievement._id);
            const progress = getProgress(achievement);
            
            return (
              <div
                key={achievement._id}
                className={`minecraft-card p-4 sm:p-5 md:p-6 transition ${
                  earned
                    ? "bg-[#5A5A5A]"
                    : "bg-[#4A4A4A]"
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div
                    className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 minecraft-block flex items-center justify-center text-2xl sm:text-3xl md:text-4xl flex-shrink-0 ${
                      achievement.category === "milestone" ? "bg-[#FFD700]" :
                      achievement.category === "streak" ? "bg-[#FF6B35]" :
                      achievement.category === "skill" ? "bg-[#87CEEB]" :
                      achievement.category === "community" ? "bg-[#9C27B0]" :
                      "bg-[#616161]"
                    }`}
                  >
                    {achievement.icon || "⭐"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1 sm:mb-2 gap-2">
                      <h3 className="text-white font-bold text-base sm:text-lg md:text-xl minecraft-title">{achievement.name}</h3>
                      {earned && (
                        <div className="minecraft-block bg-[#4CAF50] text-white px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                    <p className="text-gray-200 text-sm sm:text-base md:text-lg mb-1 sm:mb-2">{achievement.description}</p>
                    <div className="flex items-center gap-2 text-sm sm:text-base text-[#FFD700] font-bold">
                      {getCategoryIcon(achievement.category)}
                      <span className="capitalize">{achievement.category}</span>
                    </div>
                  </div>
                </div>
                
                {!earned && (
                  <div className="mt-3 sm:mt-4">
                    <div className="flex items-center justify-between text-sm sm:text-base text-gray-200 mb-1 sm:mb-2 font-bold">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="minecraft-block bg-[#2A2A2A] h-2.5 sm:h-3 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          achievement.category === "milestone" ? "bg-[#FFD700]" :
                          achievement.category === "streak" ? "bg-[#FF6B35]" :
                          achievement.category === "skill" ? "bg-[#87CEEB]" :
                          achievement.category === "community" ? "bg-[#9C27B0]" :
                          "bg-[#616161]"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="mt-3 sm:mt-4 flex items-center gap-3 sm:gap-4 text-sm sm:text-base font-bold">
                  {achievement.xpReward > 0 && (
                    <span className="text-[#9C27B0]">
                      +{achievement.xpReward} XP
                    </span>
                  )}
                  {achievement.coinReward > 0 && (
                    <span className="text-[#FFD700]">
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

