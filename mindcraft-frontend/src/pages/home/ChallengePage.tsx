import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getChallengeByIdApi, completeChallengeApi } from "@/api/challenge/challenge.api";
import type { ChallengeType } from "@/types/challenge/challenge.type";
import { Target, Clock, Coins, TrendingUp, Upload, ArrowLeft, Trophy, Award } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useUserStore } from "@/stores/user/useUserStore";

const ChallengePage = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const { fetchUser } = useUserStore();
  const [challenge, setChallenge] = useState<ChallengeType | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    files: [] as string[],
    links: [] as string[],
  });

  useEffect(() => {
    if (challengeId) {
      getChallengeByIdApi(challengeId)
        .then(setChallenge)
        .catch((error) => {
          console.error("Error loading challenge:", error);
          toast.error("Failed to load challenge");
        })
        .finally(() => setLoading(false));
    }
  }, [challengeId]);

  const handleSubmit = async () => {
    if (!challengeId || formData.files.length === 0) {
      toast.error("Please provide at least one file URL");
      return;
    }

    setSubmitting(true);
    try {
      const result = await completeChallengeApi(challengeId, formData);
      toast.success("Challenge completed successfully! 🎉");
      
      // Show level up notification if applicable
      if (result.levelUp) {
        toast.success(`Level Up! You're now level ${result.user.level}!`, { duration: 5000 });
      }
      
      // Show badges earned
      if (result.newBadges && result.newBadges.length > 0) {
        result.newBadges.forEach((badge: any) => {
          toast.success(`🏆 Badge Earned: ${badge.name}!`, { duration: 5000 });
        });
      }
      
      // Show achievements unlocked
      if (result.newAchievements && result.newAchievements.length > 0) {
        result.newAchievements.forEach((achievement: any) => {
          toast.success(`⭐ Achievement Unlocked: ${achievement.name}!`, { duration: 5000 });
        });
      }
      
      // Refresh user data
      await fetchUser();
      
      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate("/home/dashboard");
      }, 1500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit challenge");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full minecraft-bg flex items-center justify-center">
        <div className="text-white text-3xl font-bold minecraft-title">Loading...</div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen w-full minecraft-bg flex items-center justify-center">
        <div className="text-white text-3xl font-bold minecraft-title">Challenge not found</div>
      </div>
    );
  }

  const skillPathName =
    typeof challenge.skillPathId === "object" ? challenge.skillPathId.name : "Unknown";

  return (
    <div className="min-h-screen w-full minecraft-bg overflow-y-scroll no-scrollbar pb-20 sm:pb-24">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <Link
          to="/home/dashboard"
          className="inline-flex items-center gap-2 text-[#7CB342] hover:text-[#689F38] mb-4 sm:mb-6 transition text-base sm:text-lg font-bold"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Back to Dashboard
        </Link>
        <div className="minecraft-card bg-[#4A4A4A] p-4 sm:p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-[#7CB342]" />
            <span className="text-[#E8F5E9] text-sm sm:text-base md:text-lg font-bold">{skillPathName}</span>
            <span className="text-gray-500 hidden sm:inline">•</span>
            <span className="text-gray-200 text-sm sm:text-base md:text-lg font-bold">Day {challenge.dayNumber}</span>
            <span className="text-gray-500 hidden sm:inline">•</span>
            <span className="minecraft-block bg-[#9C27B0] text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-bold capitalize">
              {challenge.difficulty}
            </span>
          </div>

          <h1 className="text-white text-4xl font-bold mb-4">{challenge.title}</h1>
          <p className="text-gray-300 text-lg mb-8">{challenge.description}</p>

          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-6 mb-8 border border-purple-500/30">
            <h2 className="text-white font-bold text-xl mb-3">Instructions</h2>
            <p className="text-gray-200 whitespace-pre-line leading-relaxed">{challenge.instructions}</p>
          </div>

          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center gap-2 bg-purple-600/20 px-4 py-2 rounded-xl">
              <TrendingUp className="w-5 h-5 text-purple-300" />
              <span className="text-white font-semibold">{challenge.xpReward} XP</span>
            </div>
            <div className="flex items-center gap-2 bg-yellow-600/20 px-4 py-2 rounded-xl">
              <Coins className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-semibold">{challenge.coinReward} Coins</span>
            </div>
            {challenge.estimatedTime && (
              <div className="flex items-center gap-2 bg-blue-600/20 px-4 py-2 rounded-xl">
                <Clock className="w-5 h-5 text-blue-300" />
                <span className="text-white font-semibold">~{challenge.estimatedTime} min</span>
              </div>
            )}
          </div>

          <div className="bg-gray-700/50 rounded-2xl p-8 mb-6 border border-gray-600">
            <h2 className="text-white font-bold text-2xl mb-6 flex items-center gap-2">
              <Upload className="w-6 h-6 text-purple-400" />
              Submit Your Work
            </h2>

            <div className="space-y-6">
              <div>
                <label className="text-white font-semibold text-sm mb-2 block">Title (optional)</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Give your work a title"
                />
              </div>

              <div>
                <label className="text-white font-semibold text-sm mb-2 block">Description (optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[120px]"
                  placeholder="Describe your work, process, or any notes"
                />
              </div>

              <div>
                <label className="text-white font-semibold text-sm mb-2 block">File URLs (one per line)</label>
                <textarea
                  value={formData.files.join("\n")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      files: e.target.value.split("\n").filter((f) => f.trim()),
                    })
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px] font-mono text-sm"
                  placeholder="Paste file URLs here (one per line)"
                />
                <p className="text-gray-400 text-xs mt-2">
                  Note: File upload functionality will be implemented separately
                </p>
              </div>

              <div>
                <label className="text-white font-semibold text-sm mb-2 block">Links (optional, one per line)</label>
                <textarea
                  value={formData.links.join("\n")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      links: e.target.value.split("\n").filter((l) => l.trim()),
                    })
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[80px] font-mono text-sm"
                  placeholder="Figma, CodePen, GitHub links, etc."
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || formData.files.length === 0}
              className="mt-6 sm:mt-8 w-full minecraft-button bg-[#7CB342] hover:bg-[#689F38] disabled:bg-[#616161] disabled:cursor-not-allowed text-white px-4 py-3 sm:px-6 sm:py-4 font-bold text-base sm:text-lg md:text-xl"
            >
              {submitting ? "Submitting..." : "Complete Challenge →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengePage;

