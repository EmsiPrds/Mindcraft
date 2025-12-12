import { useState, useEffect } from "react";
import { Sparkles, Loader2, CheckCircle, XCircle, Wand2, ArrowRight, Target, Zap, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllSkillPathsApi, createSkillPathApi } from "@/api/skillPath/skillPath.api";
import { generateAIChallengeApi } from "@/api/challenge/challenge.api";
import { getAllChallengesApi } from "@/api/challenge/challenge.api";
import type { SkillPathType } from "@/types/skillPath/skillPath.type";
import type { ChallengeType } from "@/types/challenge/challenge.type";

// Default skill paths for quick creation
const DEFAULT_SKILL_PATHS = [
  {
    name: "Graphic Design",
    description: "Master the art of visual communication through typography, color theory, and layout design.",
    icon: "🎨",
    color: "#FF6B6B",
    difficulty: "beginner" as const,
  },
  {
    name: "Digital Art",
    description: "Explore digital painting, illustration, and concept art using digital tools and techniques.",
    icon: "🖌️",
    color: "#4ECDC4",
    difficulty: "beginner" as const,
  },
  {
    name: "Web Dev",
    description: "Build modern, responsive websites and web applications with HTML, CSS, JavaScript, and frameworks.",
    icon: "💻",
    color: "#45B7D1",
    difficulty: "intermediate" as const,
  },
  {
    name: "UI/UX",
    description: "Design intuitive and beautiful user interfaces with UX principles, wireframing, and prototyping.",
    icon: "✨",
    color: "#96CEB4",
    difficulty: "intermediate" as const,
  },
];

// Use local n8n for development, remote for production
const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "https://n8n.cloudmateria.com/webhook/generate-challenge";

type Step = "select" | "generating" | "result";

const SelectSkillPathAndGeneratePage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("select");
  const [skillPaths, setSkillPaths] = useState<SkillPathType[]>([]);
  const [selectedSkillPath, setSelectedSkillPath] = useState<SkillPathType | null>(null);
  const [loadingSkillPaths, setLoadingSkillPaths] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedChallenge, setGeneratedChallenge] = useState<ChallengeType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nextDayNumber, setNextDayNumber] = useState<number>(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingSkillPath, setCreatingSkillPath] = useState(false);
  const [newSkillPath, setNewSkillPath] = useState({
    name: "",
    description: "",
    icon: "🎯",
    color: "#8B5CF6",
    difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
  });

  // Load skill paths on mount
  useEffect(() => {
    loadSkillPaths();
  }, []);

  // Load existing challenges when skill path is selected
  useEffect(() => {
    if (selectedSkillPath) {
      loadExistingChallenges(selectedSkillPath._id);
    }
  }, [selectedSkillPath]);

  const loadSkillPaths = async () => {
    try {
      setLoadingSkillPaths(true);
      const paths = await getAllSkillPathsApi();
      const activePaths = paths.filter((sp) => sp.isActive);
      setSkillPaths(activePaths);
    } catch (error: any) {
      toast.error("Failed to load skill paths");
      console.error(error);
    } finally {
      setLoadingSkillPaths(false);
    }
  };

  const loadExistingChallenges = async (skillPathId: string) => {
    try {
      const response = await getAllChallengesApi({ skillPathId, isActive: true });
      const challenges = response.challenges || [];
      
      // Calculate next day number
      if (challenges.length > 0) {
        const maxDay = Math.max(...challenges.map((c) => c.dayNumber || 0));
        setNextDayNumber(maxDay + 1);
      } else {
        setNextDayNumber(1);
      }
    } catch (error: any) {
      console.error("Failed to load existing challenges:", error);
    }
  };

  const createDefaultSkillPath = async (defaultPath: typeof DEFAULT_SKILL_PATHS[0]) => {
    try {
      const newPath = await createSkillPathApi({
        name: defaultPath.name,
        description: defaultPath.description,
        icon: defaultPath.icon,
        color: defaultPath.color,
        difficulty: defaultPath.difficulty,
        isActive: true,
        order: skillPaths.length,
      });
      
      setSkillPaths([...skillPaths, newPath]);
      setSelectedSkillPath(newPath);
      toast.success(`${defaultPath.name} skill path created!`);
    } catch (error: any) {
      toast.error(`Failed to create ${defaultPath.name}: ${error.message || "Unknown error"}`);
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
      setSelectedSkillPath(newPath);
      setShowCreateModal(false);
      setNewSkillPath({ name: "", description: "", icon: "🎯", color: "#8B5CF6", difficulty: "beginner" });
      toast.success("Custom skill path created!");
    } catch (error: any) {
      toast.error(`Failed to create skill path: ${error.message || "Unknown error"}`);
    } finally {
      setCreatingSkillPath(false);
    }
  };

  const handleSelectSkillPath = (skillPath: SkillPathType) => {
    setSelectedSkillPath(skillPath);
  };

  const handleGenerateChallenge = async () => {
    if (!selectedSkillPath) {
      toast.error("Please select a skill path first");
      return;
    }

    setGenerating(true);
    setCurrentStep("generating");
    setError(null);
    setGeneratedChallenge(null);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skillPathId: selectedSkillPath._id }),
      });

      const data = await response.json();

      if (response.ok) {
        const challenge = data.data?.data || data.data;
        setGeneratedChallenge(challenge);
        setCurrentStep("result");
        toast.success("AI challenge generated successfully!");
        // Reload challenges to update day number
        await loadExistingChallenges(selectedSkillPath._id);
      } else {
        const errorMessage = data.error || data.message || "Unknown error";
        setError(errorMessage);
        setCurrentStep("result");
        toast.error("Failed to generate challenge");
      }
    } catch (error: any) {
      const errorMessage = error.message || "Network error";
      setError(errorMessage);
      setCurrentStep("result");
      toast.error("Error connecting to AI workflow");
    } finally {
      setGenerating(false);
    }
  };

  const handleStartOver = () => {
    setCurrentStep("select");
    setSelectedSkillPath(null);
    setGeneratedChallenge(null);
    setError(null);
  };

  const getDefaultSkillPaths = () => {
    return DEFAULT_SKILL_PATHS.filter(
      (defaultPath) => !skillPaths.some((sp) => sp.name.toLowerCase() === defaultPath.name.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 overflow-y-scroll no-scrollbar pb-24">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Generate AI Challenge</h1>
          </div>
          <p className="text-gray-300 text-lg">
            Select a skill path and let AI create an engaging challenge for you
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${currentStep !== "select" ? "text-purple-400" : "text-white"}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              currentStep !== "select" ? "bg-purple-600" : "bg-gray-700"
            }`}>
              {currentStep !== "select" ? <CheckCircle className="w-6 h-6" /> : "1"}
            </div>
            <span className="font-semibold">Select Path</span>
          </div>
          <ArrowRight className="w-6 h-6 text-gray-600" />
          <div className={`flex items-center gap-2 ${
            currentStep === "generating" || currentStep === "result" ? "text-purple-400" : "text-gray-500"
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              currentStep === "generating" || currentStep === "result" ? "bg-purple-600" : "bg-gray-700"
            }`}>
              {currentStep === "result" ? <CheckCircle className="w-6 h-6" /> : currentStep === "generating" ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : "2"}
            </div>
            <span className="font-semibold">Generate</span>
          </div>
        </div>

        {/* Step 1: Select Skill Path */}
        {currentStep === "select" && (
          <div className="space-y-6">
            {/* Create Custom Skill Path Button - Always Visible */}
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl text-lg"
              >
                <Plus className="w-6 h-6" />
                <span>Create Custom Skill Path</span>
              </button>
            </div>

            {/* Existing Skill Paths */}
            {loadingSkillPaths ? (
              <div className="flex items-center justify-center gap-2 text-gray-400 py-12">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Loading skill paths...</span>
              </div>
            ) : (
              <>
                {skillPaths.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <Target className="w-6 h-6 text-purple-400" />
                      Select a Skill Path
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {skillPaths.map((path) => (
                        <button
                          key={path._id}
                          onClick={() => handleSelectSkillPath(path)}
                          className={`bg-gray-800 rounded-2xl p-6 border-2 transition-all text-left hover:scale-105 ${
                            selectedSkillPath?._id === path._id
                              ? "border-purple-500 bg-purple-900/20 shadow-lg shadow-purple-500/20"
                              : "border-gray-700 hover:border-purple-500/50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-4xl">{path.icon || "🎯"}</div>
                            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold capitalize">
                              {path.difficulty}
                            </span>
                          </div>
                          <h3 className="text-white text-xl font-bold mb-2">{path.name}</h3>
                          <p className="text-gray-300 text-sm mb-4 line-clamp-2">{path.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>{path.totalChallenges} challenges</span>
                          </div>
                          {selectedSkillPath?._id === path._id && (
                            <div className="mt-4 flex items-center gap-2 text-purple-400">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm font-semibold">Selected</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Default Skill Paths (Quick Create) */}
                {getDefaultSkillPaths().length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <Zap className="w-6 h-6 text-yellow-400" />
                      Quick Create Categories
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {getDefaultSkillPaths().map((defaultPath, idx) => (
                        <button
                          key={idx}
                          onClick={() => createDefaultSkillPath(defaultPath)}
                          className="bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-yellow-500/50 rounded-2xl p-5 text-left transition-all hover:scale-105"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-3xl">{defaultPath.icon}</div>
                            <span className="bg-yellow-600/20 text-yellow-300 px-2 py-1 rounded-full text-xs font-bold capitalize">
                              {defaultPath.difficulty}
                            </span>
                          </div>
                          <h3 className="text-white font-bold mb-2">{defaultPath.name}</h3>
                          <p className="text-gray-400 text-xs line-clamp-2">{defaultPath.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                {selectedSkillPath && (
                  <div className="mt-8 bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-white text-xl font-bold mb-2">Selected: {selectedSkillPath.name}</h3>
                        <p className="text-gray-300 text-sm">{selectedSkillPath.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                          <span>Difficulty: <span className="text-white capitalize">{selectedSkillPath.difficulty}</span></span>
                          <span>Next Challenge: <span className="text-purple-300 font-semibold">Day {nextDayNumber}</span></span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleGenerateChallenge}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl"
                    >
                      <Wand2 className="w-6 h-6" />
                      <span>Generate AI Challenge</span>
                    </button>
                  </div>
                )}

                {skillPaths.length === 0 && getDefaultSkillPaths().length === 0 && (
                  <div className="text-center py-12 bg-gray-800/50 rounded-2xl border border-gray-700">
                    <p className="text-gray-400 mb-4">All skill paths have been created!</p>
                    <p className="text-gray-500 text-sm">Select a skill path above to generate a challenge.</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 2: Generating */}
        {currentStep === "generating" && (
          <div className="bg-gray-800/50 rounded-2xl p-12 border border-gray-700 text-center">
            <Loader2 className="w-16 h-16 animate-spin text-purple-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Generating Your Challenge...</h2>
            <p className="text-gray-300 mb-2">Our AI is crafting a unique challenge for you</p>
            <p className="text-gray-400 text-sm">This may take a few moments</p>
          </div>
        )}

        {/* Step 3: Result */}
        {currentStep === "result" && (
          <div className="space-y-6">
            {generatedChallenge ? (
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-green-500/50">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                  <h2 className="text-2xl font-bold text-green-400">Challenge Generated Successfully!</h2>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-6 mb-6">
                  <h3 className="text-white text-2xl font-bold mb-4">{generatedChallenge.title}</h3>
                  
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

                <div className="flex gap-4">
                  {generatedChallenge._id && (
                    <button
                      onClick={() => navigate(`/home/challenge/${generatedChallenge._id}`)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition"
                    >
                      View Challenge
                    </button>
                  )}
                  <button
                    onClick={handleStartOver}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition"
                  >
                    Generate Another
                  </button>
                </div>
              </div>
            ) : error && (
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-red-500/50">
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="w-8 h-8 text-red-400" />
                  <h2 className="text-2xl font-bold text-red-400">Generation Failed</h2>
                </div>
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
                  <p className="text-red-300 font-medium mb-2">Error Details:</p>
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
                <button
                  onClick={handleStartOver}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}

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
      </div>
    </div>
  );
};

export default SelectSkillPathAndGeneratePage;

