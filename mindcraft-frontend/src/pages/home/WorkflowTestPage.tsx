import { useState } from "react";
import { Sparkles, Play, CheckCircle, XCircle, Loader2, RefreshCw, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// Use local n8n for development, remote for production
const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "https://n8n.cloudmateria.com/webhook/generate-challenge";

interface TestResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp?: string;
}

const WorkflowTestPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [skillPathId, setSkillPathId] = useState("");

  const testWorkflow = async (useSpecificSkillPath = false) => {
    setLoading(true);
    setResult(null);

    try {
      const body = useSpecificSkillPath && skillPathId 
        ? { skillPathId } 
        : {};

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          data: data,
          timestamp: new Date().toISOString(),
        });
        toast.success("Challenge generated successfully!");
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
      toast.error("Error connecting to workflow");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">AI Challenge Generator Test</h1>
          </div>
          <p className="text-gray-300 text-lg mb-4">
            Test the n8n workflow that generates AI-powered daily challenges using Google Gemini
          </p>
          <Link
            to="/home/ai-generate-challenge"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
          >
            <span>Go to AI Challenge Generator</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Webhook Info */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">Webhook URL:</p>
          <code className="text-purple-300 text-sm break-all">{WEBHOOK_URL}</code>
        </div>

        {/* Test Controls */}
        <div className="bg-gray-800/50 rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Test Options</h2>
          
          {/* Test All Skill Paths */}
          <div className="mb-6">
            <button
              onClick={() => testWorkflow(false)}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Challenge...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Generate Challenge for All Active Skill Paths</span>
                </>
              )}
            </button>
            <p className="text-gray-400 text-sm mt-2">
              Generates challenges for all active skill paths in your database
            </p>
          </div>

          {/* Test Specific Skill Path */}
          <div>
            <label className="block text-white font-medium mb-2">
              Or test for a specific skill path:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillPathId}
                onChange={(e) => setSkillPathId(e.target.value)}
                placeholder="Enter skill path ID (optional)"
                className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                disabled={loading}
              />
              <button
                onClick={() => testWorkflow(true)}
                disabled={loading || !skillPathId}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg flex items-center gap-2 transition-all"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Test</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Enter a skill path ID to generate a challenge for that specific path
            </p>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              {result.success ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <h2 className="text-xl font-semibold text-green-400">Success</h2>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-400" />
                  <h2 className="text-xl font-semibold text-red-400">Error</h2>
                </>
              )}
              {result.timestamp && (
                <span className="text-gray-400 text-sm ml-auto">
                  {new Date(result.timestamp).toLocaleString()}
                </span>
              )}
            </div>

            {result.success && result.data && (
              <div className="space-y-4">
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Generated Challenge:</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Title:</span>
                      <span className="text-white ml-2">{result.data.data?.title || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Description:</span>
                      <span className="text-white ml-2">{result.data.data?.description || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Day Number:</span>
                      <span className="text-white ml-2">{result.data.data?.dayNumber || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Difficulty:</span>
                      <span className="text-white ml-2 capitalize">{result.data.data?.difficulty || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">AI Generated:</span>
                      <span className="text-purple-300 ml-2">
                        {result.data.data?.aiGenerated ? "Yes" : "No"}
                      </span>
                    </div>
                    {result.data.data?._id && (
                      <div>
                        <span className="text-gray-400">Challenge ID:</span>
                        <span className="text-white ml-2 font-mono text-xs">{result.data.data._id}</span>
                      </div>
                    )}
                  </div>
                </div>

                <details className="bg-gray-900/50 rounded-lg p-4">
                  <summary className="text-white font-medium cursor-pointer">View Full Response</summary>
                  <pre className="mt-4 text-xs text-gray-300 overflow-auto max-h-96">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              </div>
            )}

            {!result.success && result.error && (
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-300 font-medium mb-2">Error Details:</p>
                <p className="text-red-200 text-sm">{result.error}</p>
                <details className="mt-4">
                  <summary className="text-red-300 text-sm cursor-pointer">View Full Error</summary>
                  <pre className="mt-2 text-xs text-red-200 overflow-auto max-h-96">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-blue-900/20 border border-blue-500/50 rounded-lg p-4">
          <h3 className="text-blue-300 font-medium mb-2">💡 Instructions</h3>
          <ul className="text-blue-200 text-sm space-y-1 list-disc list-inside">
            <li>Make sure your backend is running on port 3000</li>
            <li>Ensure you have at least one active skill path in your database</li>
            <li>The workflow will generate challenges using Google Gemini AI</li>
            <li>Check n8n execution logs for detailed workflow information</li>
            <li>Generated challenges will appear in your database with <code className="bg-blue-900/50 px-1 rounded">aiGenerated: true</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkflowTestPage;

