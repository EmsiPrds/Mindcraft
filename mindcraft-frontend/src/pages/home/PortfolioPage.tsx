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
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 overflow-y-scroll no-scrollbar pb-24">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-white text-4xl font-bold mb-2">My Portfolio</h1>
          <p className="text-purple-200">Showcase your completed challenges</p>
        </div>

        {submissions.length === 0 ? (
          <div className="bg-gray-800 rounded-3xl p-16 border border-purple-500/20 shadow-2xl text-center">
            <Image className="w-20 h-20 text-gray-500 mx-auto mb-6" />
            <p className="text-white text-xl font-semibold mb-2">No portfolio items yet</p>
            <p className="text-gray-400">
              Complete challenges and add them to your portfolio
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl hover:border-purple-500/50 hover:shadow-2xl transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-purple-300 text-sm font-semibold">{skillPathName}</span>
                    <div className="flex items-center gap-2">
                      {submission.isPublic ? (
                        <div className="flex items-center gap-1 text-green-400 text-xs">
                          <Eye className="w-4 h-4" />
                          <span>Public</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                          <EyeOff className="w-4 h-4" />
                          <span>Private</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3">
                    {submission.title || challengeTitle}
                  </h3>
                  {submission.description && (
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {submission.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-lg text-xs font-semibold">
                      {submission.xpEarned} XP
                    </span>
                    <span className="bg-yellow-600/20 text-yellow-300 px-3 py-1 rounded-lg text-xs font-semibold">
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
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm bg-blue-600/20 px-3 py-1 rounded-lg"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View
                        </a>
                      ))}
                    </div>
                  )}
                  <div className="text-gray-400 text-xs">
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

