import type { CustomRequest, Response } from "@/types/express/express.type";
import {
  createChallengeS,
  getAllChallengesS,
  getChallengeByIdS,
  updateChallengeS,
  deleteChallengeS,
} from "@/services/challenge/challenge.service";
import {
  getTodaysChallengeS,
  getUserChallengeProgressS,
  completeChallengeS,
} from "@/services/challenge/userChallenge.service";
import { AppError } from "@/utils/error/appError";
import https from "https";
import { URL } from "url";

/**
 * Get today's challenge for authenticated user
 */
export const getTodaysChallenge = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (!req.account) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await getTodaysChallengeS(req.account._id.toString());

  if (!result) {
    res.status(404).json({
      message: "No challenge available. Please select a skill path.",
    });
    return;
  }

  res.status(200).json({
    message: "Challenge retrieved successfully",
    data: result,
  });
};

/**
 * Get user's challenge progress for a skill path
 */
export const getChallengeProgress = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (!req.account) {
    throw new AppError("Unauthorized", 401);
  }

  const { skillPathId } = req.params;
  if (!skillPathId) {
    throw new AppError("Skill path ID is required", 400);
  }

  const progress = await getUserChallengeProgressS(
    req.account._id.toString(),
    skillPathId
  );

  res.status(200).json({
    message: "Progress retrieved successfully",
    data: progress,
  });
};

/**
 * Create a new challenge (Admin only - will add admin check later)
 */
export const createChallenge = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const {
    title,
    description,
    instructions,
    skillPathId,
    difficulty,
    dayNumber,
    xpReward,
    coinReward,
    estimatedTime,
    tags,
    exampleImages,
    aiGenerated,
  } = req.body;

  // Validate required fields
  const requiredFields = {
    title,
    description,
    instructions,
    skillPathId,
    difficulty,
    dayNumber,
  };

  for (const [field, value] of Object.entries(requiredFields)) {
    if (!value) {
      throw new AppError(`${field} is required`, 400);
    }
  }

  const challenge = await createChallengeS({
    title,
    description,
    instructions,
    skillPathId,
    difficulty,
    dayNumber,
    xpReward: xpReward || 100,
    coinReward: coinReward || 10,
    estimatedTime,
    tags: tags || [],
    exampleImages: exampleImages || [],
    aiGenerated: aiGenerated || false,
    isActive: true,
  });

  res.status(201).json({
    message: "Challenge created successfully",
    data: challenge,
  });
};

/**
 * Get all challenges (with optional filters)
 */
export const getAllChallenges = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { skillPathId, difficulty, isActive, limit, skip } = req.query;

  const filters: any = {};
  if (skillPathId) filters.skillPathId = skillPathId as string;
  if (difficulty) filters.difficulty = difficulty as string;
  if (isActive !== undefined) filters.isActive = isActive === "true";
  if (limit) filters.limit = parseInt(limit as string);
  if (skip) filters.skip = parseInt(skip as string);

  const result = await getAllChallengesS(filters);

  res.status(200).json({
    message: "Challenges retrieved successfully",
    data: result,
  });
};

/**
 * Get challenge by ID
 */
export const getChallengeById = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { challengeId } = req.params;

  if (!challengeId) {
    throw new AppError("Challenge ID is required", 400);
  }

  const challenge = await getChallengeByIdS(challengeId);

  if (!challenge) {
    throw new AppError("Challenge not found", 404);
  }

  res.status(200).json({
    message: "Challenge retrieved successfully",
    data: challenge,
  });
};

/**
 * Update challenge
 */
export const updateChallenge = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { challengeId } = req.params;
  const updates = req.body;

  if (!challengeId) {
    throw new AppError("Challenge ID is required", 400);
  }

  const challenge = await updateChallengeS(challengeId, updates);

  if (!challenge) {
    throw new AppError("Challenge not found", 404);
  }

  res.status(200).json({
    message: "Challenge updated successfully",
    data: challenge,
  });
};

/**
 * Delete challenge (soft delete)
 */
export const deleteChallenge = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { challengeId } = req.params;

  if (!challengeId) {
    throw new AppError("Challenge ID is required", 400);
  }

  const deleted = await deleteChallengeS(challengeId);

  if (!deleted) {
    throw new AppError("Challenge not found", 404);
  }

  res.status(200).json({
    message: "Challenge deleted successfully",
  });
};

/**
 * Complete a challenge (submit work)
 */
export const completeChallenge = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (!req.account) {
    throw new AppError("Unauthorized", 401);
  }

  const { challengeId } = req.params;
  const { title, description, files, links } = req.body;

  if (!challengeId) {
    throw new AppError("Challenge ID is required", 400);
  }

  if (!files || !Array.isArray(files) || files.length === 0) {
    throw new AppError("At least one file is required", 400);
  }

  const result = await completeChallengeS(req.account._id.toString(), challengeId, {
    title,
    description,
    files,
    links,
  });

  res.status(200).json({
    message: "Challenge completed successfully!",
    data: result,
  });
};

/**
 * Generate and save an AI-generated challenge
 * This endpoint is designed for AI agents (like n9n workflows) to submit generated challenges
 */
export const generateAIChallenge = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const {
    title,
    description,
    instructions,
    skillPathId,
    difficulty,
    dayNumber,
    xpReward,
    coinReward,
    estimatedTime,
    tags,
    exampleImages,
  } = req.body;

  // Validate required fields
  const requiredFields = {
    title,
    description,
    instructions,
    skillPathId,
    difficulty,
    dayNumber,
  };

  for (const [field, value] of Object.entries(requiredFields)) {
    if (!value) {
      throw new AppError(`${field} is required`, 400);
    }
  }

  // Validate difficulty enum
  const validDifficulties = ["beginner", "intermediate", "advanced"];
  if (!validDifficulties.includes(difficulty)) {
    throw new AppError(
      `difficulty must be one of: ${validDifficulties.join(", ")}`,
      400
    );
  }

  // Validate dayNumber is a positive integer
  if (!Number.isInteger(dayNumber) || dayNumber < 1) {
    throw new AppError("dayNumber must be a positive integer", 400);
  }

  // Validate skillPathId exists
  const SkillPath = (await import("@/models/skillPath.model")).default;
  const skillPath = await SkillPath.findById(skillPathId).exec();
  if (!skillPath) {
    throw new AppError("Skill path not found", 404);
  }

  // Create challenge with aiGenerated flag set to true
  const challenge = await createChallengeS({
    title,
    description,
    instructions,
    skillPathId,
    difficulty,
    dayNumber,
    xpReward: xpReward || 100,
    coinReward: coinReward || 10,
    estimatedTime,
    tags: tags || [],
    exampleImages: exampleImages || [],
    aiGenerated: true, // Always true for AI-generated challenges
    isActive: true,
  });

  res.status(201).json({
    message: "AI-generated challenge created successfully",
    data: challenge,
  });
};

/**
 * Trigger AI challenge generation via n8n webhook
 * This endpoint acts as a proxy to avoid CORS issues
 */
export const triggerAIChallengeGeneration = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (!req.account) {
    throw new AppError("Unauthorized", 401);
  }

  const { skillPathId } = req.body;

  if (!skillPathId) {
    throw new AppError("skillPathId is required", 400);
  }

  // Validate skillPathId exists
  const SkillPath = (await import("@/models/skillPath.model")).default;
  const skillPath = await SkillPath.findById(skillPathId).exec();
  if (!skillPath) {
    throw new AppError("Skill path not found", 404);
  }

  // Get webhook URL from environment or use default
  const webhookUrl = process.env.N8N_WEBHOOK_URL || "https://n8n.cloudmateria.com/webhook/generate-challenge";

  try {
    // Use https module to call webhook (works in all Node.js versions)
    const url = new URL(webhookUrl);
    const postData = JSON.stringify({ skillPathId });

    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
      timeout: 60000, // 60 second timeout
    };

    const data = await new Promise<any>((resolve, reject) => {
      const req = https.request(options, (res) => {
        let responseData = "";

        res.on("data", (chunk) => {
          responseData += chunk;
        });

        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(responseData));
            } catch (e) {
              reject(new AppError("Invalid JSON response from webhook", 500));
            }
          } else {
            try {
              const errorData = JSON.parse(responseData);
              reject(
                new AppError(
                  errorData.error || errorData.message || `Webhook returned status ${res.statusCode}`,
                  res.statusCode || 500
                )
              );
            } catch (e) {
              reject(new AppError(`Webhook returned status ${res.statusCode}`, res.statusCode || 500));
            }
          }
        });
      });

      req.on("error", (error) => {
        reject(new AppError(`Network error: ${error.message}`, 500));
      });

      req.on("timeout", () => {
        req.destroy();
        reject(new AppError("Request timeout - webhook took too long to respond", 504));
      });

      req.write(postData);
      req.end();
    });
    
    // Extract challenge from response (handle different response formats)
    const challenge = data.data?.data || data.data || data;

    res.status(200).json({
      message: "AI challenge generated successfully",
      data: challenge,
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    
    // Handle network errors with detailed logging
    console.error("Error in triggerAIChallengeGeneration:", {
      message: error.message,
      stack: error.stack,
      webhookUrl,
      skillPathId,
    });
    
    throw new AppError(
      error.message || "Failed to connect to AI workflow service",
      500
    );
  }
};

