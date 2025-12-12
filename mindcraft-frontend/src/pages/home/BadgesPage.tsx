import { useEffect, useState } from "react";
import { getUserBadgesApi, getAllBadgesApi } from "@/api/badge/badge.api";
import type { BadgeType } from "@/types/badge/badge.type";
import { Award, Trophy, Star, Zap, Target } from "lucide-react";
import { useUserStore } from "@/stores/user/useUserStore";

const BadgesPage = () => {
  const { user } = useUserStore();
  const [userBadges, setUserBadges] = useState<BadgeType[]>([]);
  const [allBadges, setAllBadges] = useState<BadgeType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBadges = async () => {
      try {
        const [userBadgesData, allBadgesData] = await Promise.all([
          getUserBadgesApi().catch(() => []),
          getAllBadgesApi().catch(() => []),
        ]);
        setUserBadges(userBadgesData);
        setAllBadges(allBadgesData);
      } catch (error) {
        console.error("Error loading badges:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBadges();
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "from-yellow-600 to-orange-600";
      case "epic":
        return "from-purple-600 to-pink-600";
      case "rare":
        return "from-blue-600 to-cyan-600";
      default:
        return "from-gray-600 to-gray-700";
    }
  };

  const hasBadge = (badgeId: string) => {
    return userBadges.some((b) => b._id === badgeId);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full minecraft-bg overflow-y-scroll no-scrollbar pb-20 sm:pb-24">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3 minecraft-title">
            <Award className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#9C27B0]" />
            Badges
          </h1>
          <p className="text-[#E8F5E9] text-lg sm:text-xl md:text-2xl">
            You've earned {userBadges.length} of {allBadges.length} badges
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {allBadges.map((badge) => {
            const earned = hasBadge(badge._id);
            return (
              <div
                key={badge._id}
                className={`minecraft-card p-3 sm:p-4 md:p-6 transition ${
                  earned
                    ? `bg-[#5A5A5A]`
                    : "bg-[#4A4A4A] opacity-60"
                }`}
              >
                <div className="text-center mb-3 sm:mb-4">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto minecraft-block ${getRarityColor(
                      badge.rarity
                    )} flex items-center justify-center text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3`}
                  >
                    {badge.icon || "🏆"}
                  </div>
                  {earned && (
                    <div className="inline-block minecraft-block bg-[#4CAF50] text-white px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 text-xs sm:text-sm md:text-base font-bold mb-1 sm:mb-2">
                      ✓ Earned
                    </div>
                  )}
                </div>
                <h3 className="text-white font-bold text-sm sm:text-base md:text-xl mb-1 sm:mb-2 text-center minecraft-title">{badge.name}</h3>
                <p className="text-gray-200 text-xs sm:text-sm md:text-lg text-center mb-2 sm:mb-3">{badge.description}</p>
                <div className="flex items-center justify-center gap-2 text-xs">
                  <span
                    className={`px-3 py-1 rounded-full font-semibold capitalize ${
                      badge.rarity === "legendary"
                        ? "bg-yellow-600/20 text-yellow-300"
                        : badge.rarity === "epic"
                        ? "bg-purple-600/20 text-purple-300"
                        : badge.rarity === "rare"
                        ? "bg-blue-600/20 text-blue-300"
                        : "bg-gray-600/20 text-gray-300"
                    }`}
                  >
                    {badge.rarity}
                  </span>
                  {badge.xpBonus > 0 && (
                    <span className="text-purple-400">+{badge.xpBonus} XP</span>
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

export default BadgesPage;

