import type { CustomRequest, Response } from "@/types/express/express.type";
import {
  getGlobalLeaderboardByXP,
  getGlobalLeaderboardByStreak,
  getGlobalLeaderboardByLevel,
  getSkillPathLeaderboard,
  getUserGlobalRank,
  getUserSkillPathRank,
} from "@/services/leaderboard/leaderboard.service";
import { AppError } from "@/utils/error/appError";

/**
 * Get global leaderboard by XP
 */
export const getGlobalLeaderboardXP = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { limit, skip } = req.query;

  const result = await getGlobalLeaderboardByXP({
    limit: limit ? parseInt(limit as string) : undefined,
    skip: skip ? parseInt(skip as string) : undefined,
  });

  res.status(200).json({
    message: "Leaderboard retrieved successfully",
    data: result,
  });
};

/**
 * Get global leaderboard by streak
 */
export const getGlobalLeaderboardStreak = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { limit, skip } = req.query;

  const result = await getGlobalLeaderboardByStreak({
    limit: limit ? parseInt(limit as string) : undefined,
    skip: skip ? parseInt(skip as string) : undefined,
  });

  res.status(200).json({
    message: "Leaderboard retrieved successfully",
    data: result,
  });
};

/**
 * Get global leaderboard by level
 */
export const getGlobalLeaderboardLevel = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { limit, skip } = req.query;

  const result = await getGlobalLeaderboardByLevel({
    limit: limit ? parseInt(limit as string) : undefined,
    skip: skip ? parseInt(skip as string) : undefined,
  });

  res.status(200).json({
    message: "Leaderboard retrieved successfully",
    data: result,
  });
};

/**
 * Get skill path leaderboard
 */
export const getSkillPathLeaderboard = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { skillPathId } = req.params;
  const { limit, skip } = req.query;

  if (!skillPathId) {
    throw new AppError("Skill path ID is required", 400);
  }

  const result = await getSkillPathLeaderboard(skillPathId, {
    limit: limit ? parseInt(limit as string) : undefined,
    skip: skip ? parseInt(skip as string) : undefined,
  });

  res.status(200).json({
    message: "Skill path leaderboard retrieved successfully",
    data: result,
  });
};

/**
 * Get user's global rank
 */
export const getUserGlobalRank = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (!req.account) {
    throw new AppError("Unauthorized", 401);
  }

  const { sortBy } = req.query;

  const result = await getUserGlobalRank(
    req.account._id.toString(),
    (sortBy as "xp" | "streak" | "level") || "xp"
  );

  res.status(200).json({
    message: "User rank retrieved successfully",
    data: result,
  });
};

/**
 * Get user's skill path rank
 */
export const getUserSkillPathRank = async (
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

  const result = await getUserSkillPathRank(
    req.account._id.toString(),
    skillPathId
  );

  res.status(200).json({
    message: "User skill path rank retrieved successfully",
    data: result,
  });
};

