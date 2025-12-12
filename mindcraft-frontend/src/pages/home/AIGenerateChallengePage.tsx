import { useState, useEffect } from "react";
import { Sparkles, Loader2, CheckCircle, XCircle, Wand2, RefreshCw, ArrowLeft, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllSkillPathsApi, createSkillPathApi } from "@/api/skillPath/skillPath.api";
import { generateAIChallengeApi } from "@/api/challenge/challenge.api";
import { getAllChallengesApi } from "@/api/challenge/challenge.api";
import type { SkillPathType } from "@/types/skillPath/skillPath.type";
import type { ChallengeType } from "@/types/challenge/challenge.type";

// Default skill paths
const DEFAULT_SKILL_PATHS = [
  {
    name: "Graphic Design",
    description: "Master the art of visual communication through typography, color theory, and layout design. Create stunning graphics, logos, and marketing materials.",
    icon: "🎨",
    color: "#FF6B6B",
    difficulty: "beginner" as const,
  },
  {
    name: "Digital Art",
    description: "Explore digital painting, illustration, and concept art. Learn to create beautiful artwork using digital tools and techniques.",
    icon: "🖌️",
    color: "#4ECDC4",
    difficulty: "beginner" as const,
  },
  {
    name: "Web Dev",
    description: "Build modern, responsive websites and web applications. Learn HTML, CSS, JavaScript, and popular frameworks.",
    icon: "💻",
    color: "#45B7D1",
    difficulty: "intermediate" as const,
  },
  {
    name: "UI/UX",
    description: "Design intuitive and beautiful user interfaces. Learn user experience principles, wireframing, and prototyping.",
    icon: "✨",
    color: "#96CEB4",
    difficulty: "intermediate" as const,
  },
];

// Use local n8n for development, remote for production
const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "https://n8n.cloudmateria.com/webhook/generate-challenge";

interface GenerationResult {
  success: boolean;
  challenge?: ChallengeType;
  error?: string;
  timestamp?: string;
}

const AIGenerateChallengePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillPaths, setSkillPaths] = useState<SkillPathType[]>([]);
  const [selectedSkillPathId, setSelectedSkillPathId] = useState<string>("");
  const [existingChallenges, setExistingChallenges] = useState<ChallengeType[]>([]);
  const [nextDayNumber, setNextDayNumber] = useState<number>(1);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [loadingSkillPaths, setLoadingSkillPaths] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingSkillPath, setCreatingSkillPath] = useState(false);
  const [newSkillPath, setNewSkillPath] = useState({
    name: "",
    description: "",
    difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
  });

  // Load skill paths on mount
  useEffect(() => {
    loadSkillPaths();
  }, []);

  // Load existing challenges when skill path changes
  useEffect(() => {
    if (selectedSkillPathId) {
      loadExistingChallenges(selectedSkillPathId);
    } else {
      setExistingChallenges([]);
      setNextDayNumber(1);
    }
  }, [selectedSkillPathId]);

  const loadSkillPaths = async () => {
    try {
      setLoadingSkillPaths(true);
      const paths = await getAllSkillPathsApi();
      const activePaths = paths.filter((sp) => sp.isActive);
      setSkillPaths(activePaths);
      if (activePaths.length > 0 && !selectedSkillPathId) {
        setSelectedSkillPathId(activePaths[0]._id);
      }
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
      setExistingChallenges(challenges);
      
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

  const generateViaWebhook = async () => {
    if (!selectedSkillPathId) {
      toast.error("Please select a skill path");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skillPathId: selectedSkillPathId }),
      });

      const data = await response.json();

      if (response.ok) {
        const challenge = data.data?.data || data.data;
        setResult({
          success: true,
          challenge,
          timestamp: new Date().toISOString(),
        });
        toast.success("AI challenge generated successfully!");
        // Reload challenges to update day number
        await loadExistingChallenges(selectedSkillPathId);
      } else {
        setResult({
          success: false,
          error: data.error || data.message || "Unknown error",
          timestamp: new Date().toISOString(),
        });
        toast.error("Failed to generate challenge");
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || "Network error",
        timestamp: new Date().toISOString(),
      });
      toast.error("Error connecting to AI workflow");
    } finally {
      setLoading(false);
    }
  };

  const selectedSkillPath = skillPaths.find((sp) => sp._id === selectedSkillPathId);

  // Get default skill paths that don't exist yet
  const getDefaultSkillPaths = () => {
    return DEFAULT_SKILL_PATHS.filter(
      (defaultPath) => !skillPaths.some((sp) => sp.name.toLowerCase() === defaultPath.name.toLowerCase())
    );
  };

  const createDefaultSkillPath = async (defaultPath: typeof DEFAULT_SKILL_PATHS[0]) => {
    try {
      setCreatingSkillPath(true);
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
      setSelectedSkillPathId(newPath._id);
      toast.success(`${defaultPath.name} skill path created!`);
    } catch (error: any) {
      toast.error(`Failed to create ${defaultPath.name}: ${error.message || "Unknown error"}`);
    } finally {
      setCreatingSkillPath(false);
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
        difficulty: newSkillPath.difficulty,
        isActive: true,
        order: skillPaths.length,
      });
      
      setSkillPaths([...skillPaths, newPath]);
      setSelectedSkillPathId(newPath._id);
      setShowCreateModal(false);
      setNewSkillPath({ name: "", description: "", difficulty: "beginner" });
      toast.success("Custom skill path created!");
    } catch (error: any) {
      toast.error(`Failed to create skill path: ${error.message || "Unknown error"}`);
    } finally {
      setCreatingSkillPath(false);
    }
  };

  return (
    <div className="min-h-screen w-full p-6 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">AI Challenge Generator</h1>
          </div>
          <p className="text-gray-300 text-lg">
            Generate creative, engaging daily challenges using AI for your skill paths
          </p>
        </div>

        {/* Skill Path Selection */}
        <div className="bg-gray-800/50 rounded-lg p-6 mb-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Select Skill Path</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Create Custom</span>
            </button>
          </div>
          
          {loadingSkillPaths ? (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading skill paths...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Existing Skill Paths */}
              {skillPaths.length > 0 && (
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Existing Skill Paths</label>
                  <select
                    value={selectedSkillPathId}
                    onChange={(e) => setSelectedSkillPathId(e.target.value)}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                    disabled={loading}
                  >
                    {skillPaths.map((sp) => (
                      <option key={sp._id} value={sp._id}>
                        {sp.name} ({sp.difficulty})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Default Skill Paths */}
              {getDefaultSkillPaths().length > 0 && (
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Quick Create Default Categories</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getDefaultSkillPaths().map((defaultPath, idx) => (
                      <button
                        key={idx}
                        onClick={() => createDefaultSkillPath(defaultPath)}
                        disabled={creatingSkillPath}
                        className="bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg p-4 text-left transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{defaultPath.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-white font-semibold">{defaultPath.name}</h3>
                              <span className="text-xs bg-purple-600/20 text-purple-300 px-2 py-0.5 rounded capitalize">
                                {defaultPath.difficulty}
                              </span>
                            </div>
                            <p className="text-gray-400 text-xs line-clamp-2">{defaultPath.description}</p>
                            {creatingSkillPath && (
                              <div className="flex items-center gap-2 mt-2 text-purple-400 text-xs">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Creating...</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Skill Path Info */}
              {selectedSkillPath && (
                <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
                  <div>
                    <span className="text-gray-400">Description:</span>
                    <p className="text-white mt-1">{selectedSkillPath.description}</p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Difficulty:</span>
                      <span className="text-white ml-2 capitalize">{selectedSkillPath.difficulty}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Total Challenges:</span>
                      <span className="text-white ml-2">{selectedSkillPath.totalChallenges}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Next Day:</span>
                      <span className="text-purple-300 ml-2 font-semibold">Day {nextDayNumber}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* No skill paths message */}
              {skillPaths.length === 0 && getDefaultSkillPaths().length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p className="mb-4">All default skill paths have been created!</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="text-purple-400 hover:text-purple-300 font-medium"
                  >
                    Create a custom skill path
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Create Custom Skill Path Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Create Custom Skill Path</h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewSkillPath({ name: "", description: "", difficulty: "beginner" });
                  }}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={newSkillPath.name}
                    onChange={(e) => setNewSkillPath({ ...newSkillPath, name: e.target.value })}
                    placeholder="e.g., Photography, 3D Modeling"
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                    disabled={creatingSkillPath}
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={newSkillPath.description}
                    onChange={(e) => setNewSkillPath({ ...newSkillPath, description: e.target.value })}
                    placeholder="Describe what learners will learn in this skill path..."
                    rows={4}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none resize-none"
                    disabled={creatingSkillPath}
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Difficulty Level <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={newSkillPath.difficulty}
                    onChange={(e) =>
                      setNewSkillPath({
                        ...newSkillPath,
                        difficulty: e.target.value as "beginner" | "intermediate" | "advanced",
                      })
                    }
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                    disabled={creatingSkillPath}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={createCustomSkillPath}
                    disabled={creatingSkillPath || !newSkillPath.name.trim() || !newSkillPath.description.trim()}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    {creatingSkillPath ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Create Skill Path</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setNewSkillPath({ name: "", description: "", difficulty: "beginner" });
                    }}
                    disabled={creatingSkillPath}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generation Button */}
        <div className="bg-gray-800/50 rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Generate Challenge</h2>
          <p className="text-gray-400 text-sm mb-4">
            Click the button below to generate a new AI-powered challenge for the selected skill path.
            The AI will create a creative, engaging challenge appropriate for day {nextDayNumber}.
          </p>
          
          <button
            onClick={generateViaWebhook}
            disabled={loading || !selectedSkillPathId || loadingSkillPaths}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-all disabled:cursor-not-allowed text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Generating Challenge with AI...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-6 h-6" />
                <span>Generate AI Challenge</span>
              </>
            )}
          </button>

          {selectedSkillPath && (
            <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg">
              <p className="text-blue-200 text-sm">
                <strong>Note:</strong> This will generate a challenge for <strong>{selectedSkillPath.name}</strong> 
                {" "}at <strong>Day {nextDayNumber}</strong> with difficulty level <strong className="capitalize">{selectedSkillPath.difficulty}</strong>.
                The AI will create appropriate content based on the skill path context.
              </p>
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              {result.success ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <h2 className="text-xl font-semibold text-green-400">Challenge Generated Successfully!</h2>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-400" />
                  <h2 className="text-xl font-semibold text-red-400">Generation Failed</h2>
                </>
              )}
              {result.timestamp && (
                <span className="text-gray-400 text-sm ml-auto">
                  {new Date(result.timestamp).toLocaleString()}
                </span>
              )}
            </div>

            {result.success && result.challenge && (
              <div className="space-y-4">
                <div className="bg-gray-900/50 rounded-lg p-5">
                  <h3 className="text-white font-semibold text-lg mb-4">{result.challenge.title}</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-400">Description:</span>
                      <p className="text-white mt-1">{result.challenge.description}</p>
                    </div>
                    
                    <div>
                      <span className="text-gray-400">Instructions:</span>
                      <div className="text-white mt-1 whitespace-pre-wrap bg-gray-800/50 p-3 rounded border border-gray-700">
                        {result.challenge.instructions}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-gray-700">
                      <div>
                        <span className="text-gray-400 block">Day Number</span>
                        <span className="text-white font-semibold">{result.challenge.dayNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Difficulty</span>
                        <span className="text-white font-semibold capitalize">{result.challenge.difficulty}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">XP Reward</span>
                        <span className="text-purple-300 font-semibold">{result.challenge.xpReward}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Coin Reward</span>
                        <span className="text-yellow-300 font-semibold">{result.challenge.coinReward}</span>
                      </div>
                    </div>

                    {result.challenge.tags && result.challenge.tags.length > 0 && (
                      <div className="pt-3 border-t border-gray-700">
                        <span className="text-gray-400 block mb-2">Tags:</span>
                        <div className="flex flex-wrap gap-2">
                          {result.challenge.tags.map((tag, idx) => (
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

                    {result.challenge._id && (
                      <div className="pt-3 border-t border-gray-700">
                        <button
                          onClick={() => navigate(`/home/challenge/${result.challenge!._id}`)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
                        >
                          View Challenge
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!result.success && result.error && (
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-300 font-medium mb-2">Error Details:</p>
                <p className="text-red-200 text-sm">{result.error}</p>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-blue-900/20 border border-blue-500/50 rounded-lg p-4">
          <h3 className="text-blue-300 font-medium mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            How It Works
          </h3>
          <ul className="text-blue-200 text-sm space-y-2 list-disc list-inside">
            <li>Select a skill path from the dropdown above</li>
            <li>The system automatically calculates the next day number based on existing challenges</li>
            <li>Click "Generate AI Challenge" to trigger the AI workflow</li>
            <li>The AI uses Google Gemini to create a creative, engaging challenge</li>
            <li>Generated challenges are automatically saved to your database</li>
            <li>You can view and complete the challenge immediately after generation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AIGenerateChallengePage;

