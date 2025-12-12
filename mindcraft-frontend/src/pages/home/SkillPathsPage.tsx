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
      <div className="min-h-screen w-full minecraft-bg flex items-center justify-center">
        <div className="text-white text-3xl font-bold minecraft-title">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full minecraft-bg overflow-y-scroll no-scrollbar pb-20 sm:pb-24">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3 minecraft-title">
              <Target className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#7CB342]" />
              Skill Paths
            </h1>
            <p className="text-[#E8F5E9] text-lg sm:text-xl md:text-2xl">Choose your learning journey</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="minecraft-button bg-[#7CB342] hover:bg-[#689F38] text-white font-bold py-2 px-4 sm:py-3 sm:px-6 text-base sm:text-lg md:text-xl flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="hidden sm:inline">Create Custom</span>
            <span className="sm:hidden">Create</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {skillPaths.map((path) => {
            const pathProgress = getProgressForPath(path._id);
            return (
              <div
                key={path._id}
                className="minecraft-card bg-[#4A4A4A] p-4 sm:p-5 md:p-6 hover:bg-[#5A5A5A] transition"
              >
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className="text-4xl sm:text-5xl md:text-6xl">{path.icon || "🎯"}</div>
                  <span className="minecraft-block bg-[#9C27B0] text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-bold capitalize">
                    {path.difficulty}
                  </span>
                </div>
                <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 minecraft-title">{path.name}</h3>
                <p className="text-gray-200 text-base sm:text-lg mb-4 sm:mb-5 line-clamp-3">{path.description}</p>

                {pathProgress && (
                  <div className="mb-4 sm:mb-5">
                    <div className="flex items-center justify-between text-sm sm:text-base text-gray-200 mb-2 sm:mb-3 font-bold">
                      <span className="text-xs sm:text-sm">
                        {pathProgress.progress.completed} / {pathProgress.progress.total} challenges
                      </span>
                      <span className="text-[#7CB342]">
                        {pathProgress.progress.percentage}%
                      </span>
                    </div>
                    <div className="minecraft-block bg-[#2A2A2A] h-2.5 sm:h-3 overflow-hidden">
                      <div
                        className="bg-[#7CB342] h-full transition-all"
                        style={{ width: `${pathProgress.progress.percentage}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 sm:gap-4 text-sm sm:text-base text-gray-300 mb-4 sm:mb-5 font-bold">
                  <span>{path.totalChallenges} challenges</span>
                  {path.estimatedDuration && <span>~{path.estimatedDuration} days</span>}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleSelectPath(path._id)}
                    className="flex-1 minecraft-button bg-[#7CB342] hover:bg-[#689F38] text-white px-3 py-2 sm:px-4 sm:py-3 font-bold flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg"
                  >
                    {pathProgress ? (
                      <>
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        Continue
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        Select Path
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => generateChallenge(path._id)}
                    disabled={generatingChallengeFor === path._id}
                    className="minecraft-button bg-[#FFD700] hover:bg-[#FFA500] disabled:bg-[#616161] text-[#1A1A1A] px-3 py-2 sm:px-4 sm:py-3 font-bold flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg disabled:cursor-not-allowed disabled:text-gray-400"
                    title="Generate AI Challenge"
                  >
                    {generatingChallengeFor === path._id ? (
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 animate-spin" />
                    ) : (
                      <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create Custom Skill Path Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
            <div className="minecraft-card bg-[#4A4A4A] p-4 sm:p-5 md:p-6 max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 minecraft-block bg-[#7CB342] flex items-center justify-center">
                    <Plus className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white minecraft-title">Create Custom Skill Path</h3>
                </div>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewSkillPath({ name: "", description: "", icon: "🎯", color: "#8B5CF6", difficulty: "beginner" });
                  }}
                  className="text-gray-300 hover:text-white transition p-2 hover:bg-[#5A5A5A] minecraft-button bg-[#4A4A4A]"
                  disabled={creatingSkillPath}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-white text-lg font-bold mb-2">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={newSkillPath.name}
                    onChange={(e) => setNewSkillPath({ ...newSkillPath, name: e.target.value })}
                    placeholder="e.g., Photography, 3D Modeling, Music Production"
                    className="w-full minecraft-block bg-[#4A4A4A] text-white px-4 py-3 text-lg focus:bg-[#5A5A5A] focus:border-[#7CB342]"
                    style={{
                      borderStyle: 'solid',
                      borderWidth: '3px',
                      borderColor: '#1A1A1A',
                      borderTopColor: '#6A6A6A',
                      borderLeftColor: '#6A6A6A',
                      borderRightColor: '#1A1A1A',
                      borderBottomColor: '#1A1A1A',
                    }}
                    disabled={creatingSkillPath}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white text-lg font-bold mb-2">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={newSkillPath.description}
                    onChange={(e) => setNewSkillPath({ ...newSkillPath, description: e.target.value })}
                    placeholder="Describe what learners will learn in this skill path..."
                    rows={4}
                    className="w-full minecraft-block bg-[#4A4A4A] text-white px-4 py-3 text-lg focus:bg-[#5A5A5A] focus:border-[#7CB342] resize-none"
                    style={{
                      borderStyle: 'solid',
                      borderWidth: '3px',
                      borderColor: '#1A1A1A',
                      borderTopColor: '#6A6A6A',
                      borderLeftColor: '#6A6A6A',
                      borderRightColor: '#1A1A1A',
                      borderBottomColor: '#1A1A1A',
                    }}
                    disabled={creatingSkillPath}
                  />
                </div>

                {/* Icon and Color Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Icon */}
                  <div>
                    <label className="block text-white text-lg font-bold mb-2">
                      Icon (Emoji)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={newSkillPath.icon}
                        onChange={(e) => setNewSkillPath({ ...newSkillPath, icon: e.target.value })}
                        placeholder="🎯"
                        maxLength={2}
                        className="w-20 minecraft-block bg-[#4A4A4A] text-white px-4 py-3 text-center text-2xl focus:bg-[#5A5A5A] focus:border-[#7CB342]"
                        style={{
                          borderStyle: 'solid',
                          borderWidth: '3px',
                          borderColor: '#1A1A1A',
                          borderTopColor: '#6A6A6A',
                          borderLeftColor: '#6A6A6A',
                          borderRightColor: '#1A1A1A',
                          borderBottomColor: '#1A1A1A',
                        }}
                        disabled={creatingSkillPath}
                      />
                      <div className="flex gap-2">
                        {["🎯", "🎨", "💻", "✨", "📸", "🎵", "🎬", "📚"].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setNewSkillPath({ ...newSkillPath, icon: emoji })}
                            className={`text-2xl p-2 minecraft-button transition ${
                              newSkillPath.icon === emoji
                                ? "bg-[#7CB342] scale-110"
                                : "bg-[#4A4A4A] hover:bg-[#5A5A5A]"
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
                    <label className="block text-white text-lg font-bold mb-2">
                      Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={newSkillPath.color}
                        onChange={(e) => setNewSkillPath({ ...newSkillPath, color: e.target.value })}
                        className="w-20 h-12 minecraft-block bg-[#4A4A4A] cursor-pointer"
                        style={{
                          borderStyle: 'solid',
                          borderWidth: '3px',
                          borderColor: '#1A1A1A',
                          borderTopColor: '#6A6A6A',
                          borderLeftColor: '#6A6A6A',
                          borderRightColor: '#1A1A1A',
                          borderBottomColor: '#1A1A1A',
                        }}
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
                  <label className="block text-white text-lg font-bold mb-2">
                    Difficulty Level <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["beginner", "intermediate", "advanced"] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setNewSkillPath({ ...newSkillPath, difficulty: level })}
                        className={`px-4 py-3 minecraft-button font-bold text-lg transition ${
                          newSkillPath.difficulty === level
                            ? "bg-[#7CB342] text-white"
                            : "bg-[#4A4A4A] text-gray-300 hover:bg-[#5A5A5A]"
                        }`}
                        disabled={creatingSkillPath}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="minecraft-card bg-[#5A5A5A] p-4">
                  <p className="text-gray-200 text-lg font-bold mb-3">Preview:</p>
                  <div className="minecraft-card bg-[#4A4A4A] p-4">
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
                <div className="flex gap-3 pt-4 border-t-4 border-[#1A1A1A]">
                  <button
                    onClick={createCustomSkillPath}
                    disabled={creatingSkillPath || !newSkillPath.name.trim() || !newSkillPath.description.trim()}
                    className="flex-1 minecraft-button bg-[#7CB342] hover:bg-[#689F38] disabled:bg-[#616161] text-white font-bold py-3 px-6 text-xl transition flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                  >
                    {creatingSkillPath ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-6 h-6" />
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
                    className="px-6 py-3 minecraft-button bg-[#616161] hover:bg-[#4A4A4A] text-white font-bold text-xl transition disabled:opacity-50"
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
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
            <div className="minecraft-card bg-[#4A4A4A] p-4 sm:p-5 md:p-6 max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              {generatingChallengeFor ? (
                <div className="text-center py-12">
                  <Loader2 className="w-20 h-20 animate-spin text-[#7CB342] mx-auto mb-6" />
                  <h3 className="text-3xl font-bold text-white mb-4 minecraft-title">Generating Challenge...</h3>
                  <p className="text-gray-200 text-xl mb-2">Our AI is crafting a unique challenge for you</p>
                  <p className="text-gray-300 text-lg">This may take a few moments</p>
                </div>
              ) : generatedChallenge ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 minecraft-block bg-[#4CAF50] flex items-center justify-center">
                        <Sparkles className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-white minecraft-title">Challenge Generated!</h3>
                    </div>
                    <button
                      onClick={() => {
                        setShowChallengeModal(false);
                        setGeneratedChallenge(null);
                        setGenerationError(null);
                      }}
                      className="text-gray-300 hover:text-white transition p-2 hover:bg-[#5A5A5A] minecraft-button bg-[#4A4A4A]"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="minecraft-card bg-[#5A5A5A] p-6 mb-6">
                    <h4 className="text-white text-3xl font-bold mb-4 minecraft-title">{generatedChallenge.title}</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="text-gray-200 text-lg font-bold">Description:</span>
                        <p className="text-white mt-2 text-lg">{generatedChallenge.description}</p>
                      </div>
                      
                      <div>
                        <span className="text-gray-200 text-lg font-bold">Instructions:</span>
                        <div className="text-white mt-2 whitespace-pre-wrap minecraft-card bg-[#4A4A4A] p-4 text-lg">
                          {generatedChallenge.instructions}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t-4 border-[#1A1A1A]">
                        <div>
                          <span className="text-gray-200 text-base block mb-1 font-bold">Day Number</span>
                          <span className="text-white font-bold text-xl">{generatedChallenge.dayNumber}</span>
                        </div>
                        <div>
                          <span className="text-gray-200 text-base block mb-1 font-bold">Difficulty</span>
                          <span className="text-white font-bold text-xl capitalize">{generatedChallenge.difficulty}</span>
                        </div>
                        <div>
                          <span className="text-gray-200 text-base block mb-1 font-bold">XP Reward</span>
                          <span className="text-[#9C27B0] font-bold text-xl">{generatedChallenge.xpReward}</span>
                        </div>
                        <div>
                          <span className="text-gray-200 text-base block mb-1 font-bold">Coin Reward</span>
                          <span className="text-[#FFD700] font-bold text-xl">{generatedChallenge.coinReward}</span>
                        </div>
                      </div>

                      {generatedChallenge.tags && generatedChallenge.tags.length > 0 && (
                        <div className="pt-4 border-t-4 border-[#1A1A1A]">
                          <span className="text-gray-200 text-lg font-bold block mb-2">Tags:</span>
                          <div className="flex flex-wrap gap-2">
                            {generatedChallenge.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-4 py-2 minecraft-block bg-[#9C27B0] text-white text-base font-bold"
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
                        className="flex-1 minecraft-button bg-[#7CB342] hover:bg-[#689F38] text-white font-bold py-3 px-6 text-xl transition"
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
                      className="px-6 py-3 minecraft-button bg-[#616161] hover:bg-[#4A4A4A] text-white font-bold text-xl transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : generationError ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 minecraft-block bg-red-600 flex items-center justify-center">
                        <X className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-red-400 minecraft-title">Generation Failed</h3>
                    </div>
                    <button
                      onClick={() => {
                        setShowChallengeModal(false);
                        setGenerationError(null);
                      }}
                      className="text-gray-300 hover:text-white transition p-2 hover:bg-[#5A5A5A] minecraft-button bg-[#4A4A4A]"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="minecraft-card bg-red-900/30 p-4 mb-6">
                    <p className="text-red-300 font-bold mb-2 text-lg">Error Details:</p>
                    <p className="text-red-200 text-base">{generationError}</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowChallengeModal(false);
                      setGenerationError(null);
                    }}
                    className="w-full minecraft-button bg-[#616161] hover:bg-[#4A4A4A] text-white font-bold py-3 px-6 text-xl transition"
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

