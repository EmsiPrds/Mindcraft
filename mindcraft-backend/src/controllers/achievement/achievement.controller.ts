import type { CustomRequest, Response } from "@/types/express/express.type";
import {
  createAchievementS,
  getAllAchievementsS,
  getAchievementByIdS,
  getUserAchievementsS,
} from "@/services/achievement/achievement.service";
import { findOrCreateUserS } from "@/services/user/user.service";
import { AppError } from "@/utils/error/appError";

/**
 * Get all achievements
 */
export const getAllAchievements = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { category, isActive } = req.query;

  const achievements = await getAllAchievementsS({
    category: category as string,
    isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
  });

  res.status(200).json({
    message: "Achievements retrieved successfully",
    data: achievements,
  });
};

/**
 * Get achievement by ID
 */
export const getAchievementById = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { achievementId } = req.params;

  if (!achievementId) {
    throw new AppError("Achievement ID is required", 400);
  }

  const achievement = await getAchievementByIdS(achievementId);

  if (!achievement) {
    throw new AppError("Achievement not found", 404);
  }

  res.status(200).json({
    message: "Achievement retrieved successfully",
    data: achievement,
  });
};

/**
 * Get user's achievements
 */
export const getUserAchievements = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (!req.account) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await findOrCreateUserS(req.account._id.toString());
  const achievements = await getUserAchievementsS(user._id);

  res.status(200).json({
    message: "User achievements retrieved successfully",
    data: achievements,
  });
};

/**
 * Create achievement (admin only)
 */
export const createAchievement = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  // TODO: Add admin check
  // if (!req.account?.isAdmin) {
  //   throw new AppError("Admin access required", 403);
  // }

  const {
    name,
    description,
    icon,
    category,
    requirement,
    xpReward,
    coinReward,
    isActive,
  } = req.body;

  if (!name || !description || !icon || !category || !requirement) {
    throw new AppError(
      "Name, description, icon, category, and requirement are required",
      400
    );
  }

  const achievement = await createAchievementS({
    name,
    description,
    icon,
    category,
    requirement,
    xpReward: xpReward || 0,
    coinReward: coinReward || 0,
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json({
    message: "Achievement created successfully",
    data: achievement,
  });
};

