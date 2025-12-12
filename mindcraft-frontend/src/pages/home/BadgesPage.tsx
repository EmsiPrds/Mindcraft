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
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 overflow-y-scroll no-scrollbar pb-24">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-white text-4xl font-bold mb-2 flex items-center gap-3">
            <Award className="w-10 h-10 text-purple-400" />
            Badges
          </h1>
          <p className="text-purple-200">
            You've earned {userBadges.length} of {allBadges.length} badges
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allBadges.map((badge) => {
            const earned = hasBadge(badge._id);
            return (
              <div
                key={badge._id}
                className={`bg-gray-800 rounded-3xl p-6 border-2 shadow-2xl transition ${
                  earned
                    ? `border-purple-500/50 bg-gradient-to-br from-gray-800 to-gray-800`
                    : "border-gray-700 opacity-60"
                }`}
              >
                <div className="text-center mb-4">
                  <div
                    className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${getRarityColor(
                      badge.rarity
                    )} flex items-center justify-center text-4xl mb-3 shadow-lg`}
                  >
                    {badge.icon || "🏆"}
                  </div>
                  {earned && (
                    <div className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-2">
                      ✓ Earned
                    </div>
                  )}
                </div>
                <h3 className="text-white font-bold text-lg mb-2 text-center">{badge.name}</h3>
                <p className="text-gray-300 text-sm text-center mb-3">{badge.description}</p>
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

