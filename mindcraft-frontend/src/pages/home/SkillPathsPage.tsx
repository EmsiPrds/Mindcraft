import { useEffect, useState } from "react";
import { getAllSkillPathsApi, selectSkillPathApi, getAllUserSkillPathProgressApi, createSkillPathApi } from "@/api/skillPath/skillPath.api";
import { getAllChallengesApi, triggerAIChallengeGenerationApi } from "@/api/challenge/challenge.api";
import type { SkillPathType } from "@/types/skillPath/skillPath.type";
import type { ChallengeType } from "@/types/challenge/challenge.type";
import { Target, CheckCircle, Play, Plus, X, Loader2, Wand2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useUserStore } from "@/stores/user/useUserStore";
import { useNavigate } from "react-router-dom";

const SkillPathsPage = () => {
  const navigate = useNavigate();
  const [skillPaths, setSkillPaths] = useState<SkillPathType[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingSkillPath, setCreatingSkillPath] = useState(false);
  const [newSkillPath, setNewSkillPath] = useState({
    name: "",
    description: "",
    icon: "🎯",
    color: "#8B5CF6",
    difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
  });
  const [generatingChallengeFor, setGeneratingChallengeFor] = useState<string | null>(null);
  const [generatedChallenge, setGeneratedChallenge] = useState<ChallengeType | null>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const { fetchUser } = useUserStore();
  
  const handleSelectPath = async (skillPathId: string) => {
    try {
      await selectSkillPathApi(skillPathId);
      toast.success("Skill path selected!");
      await fetchUser();
      // Reload progress data
      const userProgress = await getAllUserSkillPathProgressApi();
      setProgress(userProgress);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to select skill path");
    }
  };

  const getProgressForPath = (pathId: string) => {
    return progress.find((p) => p.skillPath._id === pathId);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [paths, userProgress] = await Promise.all([
        getAllSkillPathsApi(),
        getAllUserSkillPathProgressApi(),
      ]);
      setSkillPaths(paths);
      setProgress(userProgress);
    } catch (error) {
      console.error("Error loading skill paths:", error);
    } finally {
      setLoading(false);
    }
  };

  const createCustomSkillPath = async () => {
    if (!newSkillPath.name.trim() || !newSkillPath.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setCreatingSkillPath(true);
      const newPath = await createSkillPathApi({
        name: newSkillPath.name.trim(),
        description: newSkillPath.description.trim(),
        icon: newSkillPath.icon || "🎯",
        color: newSkillPath.color,
        difficulty: newSkillPath.difficulty,
        isActive: true,
        order: skillPaths.length,
      });
      
      setSkillPaths([...skillPaths, newPath]);
      setShowCreateModal(false);
      setNewSkillPath({ name: "", description: "", icon: "🎯", color: "#8B5CF6", difficulty: "beginner" });
      toast.success("Custom skill path created!");
      // Reload data to get updated progress
      await loadData();
    } catch (error: any) {
      toast.error(`Failed to create skill path: ${error.message || "Unknown error"}`);
    } finally {
      setCreatingSkillPath(false);
    }
  };

  const generateChallenge = async (skillPathId: string) => {
    setGeneratingChallengeFor(skillPathId);
    setGenerationError(null);
    setGeneratedChallenge(null);
    setShowChallengeModal(true);

    try {
      const challenge = await triggerAIChallengeGenerationApi(skillPathId);
      setGeneratedChallenge(challenge);
      toast.success("AI challenge generated successfully!");
      // Reload data to update challenge counts
      await loadData();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to generate challenge";
      setGenerationError(errorMessage);
      toast.error("Failed to generate challenge");
    } finally {
      setGeneratingChallengeFor(null);
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-white text-4xl font-bold mb-2 flex items-center gap-3">
              <Target className="w-10 h-10 text-purple-400" />
              Skill Paths
            </h1>
            <p className="text-purple-200">Choose your learning journey</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Create Custom</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillPaths.map((path) => {
            const pathProgress = getProgressForPath(path._id);
            return (
              <div
                key={path._id}
                className="bg-gray-800 rounded-3xl p-6 border border-gray-700 shadow-2xl hover:border-purple-500/50 transition"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="text-5xl">{path.icon || "🎯"}</div>
                  <span className="bg-purple-600 text-white px-4 py-1.5 rounded-full text-xs font-bold capitalize">
                    {path.difficulty}
                  </span>
                </div>
                <h3 className="text-white text-2xl font-bold mb-3">{path.name}</h3>
                <p className="text-gray-300 text-sm mb-5 line-clamp-3">{path.description}</p>

                {pathProgress && (
                  <div className="mb-5">
                    <div className="flex items-center justify-between text-sm text-gray-300 mb-3">
                      <span className="font-semibold">
                        {pathProgress.progress.completed} / {pathProgress.progress.total} challenges
                      </span>
                      <span className="font-semibold text-purple-400">
                        {pathProgress.progress.percentage}%
                      </span>
                    </div>
                    <div className="bg-gray-700 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all rounded-full"
                        style={{ width: `${pathProgress.progress.percentage}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-5">
                  <span>{path.totalChallenges} challenges</span>
                  {path.estimatedDuration && <span>~{path.estimatedDuration} days</span>}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelectPath(path._id)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-3 rounded-xl transition font-bold flex items-center justify-center gap-2 shadow-lg"
                  >
                    {pathProgress ? (
                      <>
                        <Play className="w-5 h-5" />
                        Continue
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Select Path
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => generateChallenge(path._id)}
                    disabled={generatingChallengeFor === path._id}
                    className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-4 py-3 rounded-xl transition font-bold flex items-center justify-center gap-2 shadow-lg disabled:cursor-not-allowed"
                    title="Generate AI Challenge"
                  >
                    {generatingChallengeFor === path._id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Wand2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create Custom Skill Path Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Create Custom Skill Path</h3>
                </div>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewSkillPath({ name: "", description: "", icon: "🎯", color: "#8B5CF6", difficulty: "beginner" });
                  }}
                  className="text-gray-400 hover:text-white transition p-2 hover:bg-gray-700 rounded-lg"
                  disabled={creatingSkillPath}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={newSkillPath.name}
                    onChange={(e) => setNewSkillPath({ ...newSkillPath, name: e.target.value })}
                    placeholder="e.g., Photography, 3D Modeling, Music Production"
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                    disabled={creatingSkillPath}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={newSkillPath.description}
                    onChange={(e) => setNewSkillPath({ ...newSkillPath, description: e.target.value })}
                    placeholder="Describe what learners will learn in this skill path..."
                    rows={4}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none resize-none"
                    disabled={creatingSkillPath}
                  />
                </div>

                {/* Icon and Color Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Icon */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Icon (Emoji)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={newSkillPath.icon}
                        onChange={(e) => setNewSkillPath({ ...newSkillPath, icon: e.target.value })}
                        placeholder="🎯"
                        maxLength={2}
                        className="w-20 bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none text-center text-2xl"
                        disabled={creatingSkillPath}
                      />
                      <div className="flex gap-2">
                        {["🎯", "🎨", "💻", "✨", "📸", "🎵", "🎬", "📚"].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setNewSkillPath({ ...newSkillPath, icon: emoji })}
                            className={`text-2xl p-2 rounded-lg transition ${
                              newSkillPath.icon === emoji
                                ? "bg-purple-600 scale-110"
                                : "bg-gray-700 hover:bg-gray-600"
                            }`}
                            disabled={creatingSkillPath}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={newSkillPath.color}
                        onChange={(e) => setNewSkillPath({ ...newSkillPath, color: e.target.value })}
                        className="w-20 h-12 bg-gray-700 rounded-lg border border-gray-600 cursor-pointer"
                        disabled={creatingSkillPath}
                      />
                      <div className="flex gap-2 flex-wrap">
                        {["#8B5CF6", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#F59E0B", "#EF4444", "#10B981"].map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setNewSkillPath({ ...newSkillPath, color })}
                            className={`w-10 h-10 rounded-lg transition ${
                              newSkillPath.color === color
                                ? "ring-2 ring-white ring-offset-2 ring-offset-gray-800 scale-110"
                                : "hover:scale-105"
                            }`}
                            style={{ backgroundColor: color }}
                            disabled={creatingSkillPath}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Difficulty Level <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["beginner", "intermediate", "advanced"] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setNewSkillPath({ ...newSkillPath, difficulty: level })}
                        className={`px-4 py-3 rounded-lg font-semibold transition ${
                          newSkillPath.difficulty === level
                            ? "bg-purple-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                        disabled={creatingSkillPath}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                  <p className="text-gray-400 text-sm font-semibold mb-3">Preview:</p>
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-3xl">{newSkillPath.icon || "🎯"}</div>
                      <span
                        className="text-white px-3 py-1 rounded-full text-xs font-bold capitalize"
                        style={{ backgroundColor: newSkillPath.color }}
                      >
                        {newSkillPath.difficulty}
                      </span>
                    </div>
                    <h4 className="text-white font-bold text-lg mb-2">
                      {newSkillPath.name || "Skill Path Name"}
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {newSkillPath.description || "Skill path description will appear here..."}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-700">
                  <button
                    onClick={createCustomSkillPath}
                    disabled={creatingSkillPath || !newSkillPath.name.trim() || !newSkillPath.description.trim()}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                  >
                    {creatingSkillPath ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        <span>Create Skill Path</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setNewSkillPath({ name: "", description: "", icon: "🎯", color: "#8B5CF6", difficulty: "beginner" });
                    }}
                    disabled={creatingSkillPath}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Challenge Generation Modal */}
        {showChallengeModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-2xl p-6 max-w-3xl w-full border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
              {generatingChallengeFor ? (
                <div className="text-center py-12">
                  <Loader2 className="w-16 h-16 animate-spin text-purple-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">Generating Challenge...</h3>
                  <p className="text-gray-300 mb-2">Our AI is crafting a unique challenge for you</p>
                  <p className="text-gray-400 text-sm">This may take a few moments</p>
                </div>
              ) : generatedChallenge ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Challenge Generated!</h3>
                    </div>
                    <button
                      onClick={() => {
                        setShowChallengeModal(false);
                        setGeneratedChallenge(null);
                        setGenerationError(null);
                      }}
                      className="text-gray-400 hover:text-white transition p-2 hover:bg-gray-700 rounded-lg"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="bg-gray-900/50 rounded-xl p-6 mb-6">
                    <h4 className="text-white text-2xl font-bold mb-4">{generatedChallenge.title}</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="text-gray-400 text-sm font-semibold">Description:</span>
                        <p className="text-white mt-2">{generatedChallenge.description}</p>
                      </div>
                      
                      <div>
                        <span className="text-gray-400 text-sm font-semibold">Instructions:</span>
                        <div className="text-white mt-2 whitespace-pre-wrap bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                          {generatedChallenge.instructions}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-700">
                        <div>
                          <span className="text-gray-400 text-xs block mb-1">Day Number</span>
                          <span className="text-white font-bold text-lg">{generatedChallenge.dayNumber}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 text-xs block mb-1">Difficulty</span>
                          <span className="text-white font-bold text-lg capitalize">{generatedChallenge.difficulty}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 text-xs block mb-1">XP Reward</span>
                          <span className="text-purple-300 font-bold text-lg">{generatedChallenge.xpReward}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 text-xs block mb-1">Coin Reward</span>
                          <span className="text-yellow-300 font-bold text-lg">{generatedChallenge.coinReward}</span>
                        </div>
                      </div>

                      {generatedChallenge.tags && generatedChallenge.tags.length > 0 && (
                        <div className="pt-4 border-t border-gray-700">
                          <span className="text-gray-400 text-sm font-semibold block mb-2">Tags:</span>
                          <div className="flex flex-wrap gap-2">
                            {generatedChallenge.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {generatedChallenge._id && (
                      <button
                        onClick={() => {
                          navigate(`/home/challenge/${generatedChallenge._id}`);
                          setShowChallengeModal(false);
                          setGeneratedChallenge(null);
                        }}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition"
                      >
                        View Challenge
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowChallengeModal(false);
                        setGeneratedChallenge(null);
                        setGenerationError(null);
                      }}
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : generationError ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                        <X className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-red-400">Generation Failed</h3>
                    </div>
                    <button
                      onClick={() => {
                        setShowChallengeModal(false);
                        setGenerationError(null);
                      }}
                      className="text-gray-400 hover:text-white transition p-2 hover:bg-gray-700 rounded-lg"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
                    <p className="text-red-300 font-medium mb-2">Error Details:</p>
                    <p className="text-red-200 text-sm">{generationError}</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowChallengeModal(false);
                      setGenerationError(null);
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition"
                  >
                    Close
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillPathsPage;

