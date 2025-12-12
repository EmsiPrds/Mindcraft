import { useEffect, useState } from "react";
import { getUserPortfolioApi } from "@/api/submission/submission.api";
import type { SubmissionType } from "@/types/submission/submission.type";
import { Image, ExternalLink, Eye, EyeOff } from "lucide-react";

const PortfolioPage = () => {
  const [submissions, setSubmissions] = useState<SubmissionType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPortfolio = async () => {
      setLoading(true);
      try {
        const data = await getUserPortfolioApi();
        setSubmissions(data.submissions || []);
      } catch (error) {
        console.error("Error loading portfolio:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPortfolio();
  }, []);

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
            <Image className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#87CEEB]" />
            My Portfolio
          </h1>
          <p className="text-[#E8F5E9] text-lg sm:text-xl md:text-2xl">Showcase your completed challenges</p>
        </div>

        {submissions.length === 0 ? (
          <div className="minecraft-card bg-[#4A4A4A] p-8 sm:p-12 md:p-16 text-center">
            <Image className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-gray-500 mx-auto mb-4 sm:mb-6" />
            <p className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-2 minecraft-title">No portfolio items yet</p>
            <p className="text-gray-300 text-base sm:text-lg md:text-xl">
              Complete challenges and add them to your portfolio
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {submissions.map((submission) => {
              const challengeTitle =
                typeof submission.challengeId === "object"
                  ? submission.challengeId.title
                  : "Challenge";
              const skillPathName =
                typeof submission.skillPathId === "object"
                  ? submission.skillPathId.name
                  : "Unknown";

              return (
                <div
                  key={submission._id}
                  className="minecraft-card bg-[#4A4A4A] p-4 sm:p-5 md:p-6 hover:bg-[#5A5A5A] transition"
                >
                  <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
                    <span className="text-[#7CB342] text-sm sm:text-base md:text-lg font-bold truncate">{skillPathName}</span>
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      {submission.isPublic ? (
                        <div className="flex items-center gap-1 text-[#4CAF50] text-xs sm:text-sm md:text-base font-bold">
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="hidden sm:inline">Public</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-400 text-xs sm:text-sm md:text-base font-bold">
                          <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="hidden sm:inline">Private</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-base sm:text-lg md:text-xl mb-2 sm:mb-3 minecraft-title">
                    {submission.title || challengeTitle}
                  </h3>
                  {submission.description && (
                    <p className="text-gray-200 text-sm sm:text-base md:text-lg mb-3 sm:mb-4 line-clamp-3">
                      {submission.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
                    <span className="minecraft-block bg-[#9C27B0] text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-bold">
                      {submission.xpEarned} XP
                    </span>
                    <span className="minecraft-block bg-[#FFD700] text-[#1A1A1A] px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-bold">
                      {submission.coinsEarned} Coins
                    </span>
                  </div>
                  {submission.links && submission.links.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {submission.links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[#87CEEB] hover:text-[#6BB6E0] text-sm sm:text-base font-bold minecraft-block bg-[#5A5A5A] px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-[#6A6A6A]"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View
                        </a>
                      ))}
                    </div>
                  )}
                  <div className="text-gray-300 text-sm sm:text-base font-bold">
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;

