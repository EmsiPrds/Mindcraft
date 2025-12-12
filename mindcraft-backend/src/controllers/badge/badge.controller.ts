import type { CustomRequest, Response } from "@/types/express/express.type";
import {
  createBadgeS,
  getAllBadgesS,
  getBadgeByIdS,
  getUserBadgesS,
} from "@/services/badge/badge.service";
import { findOrCreateUserS } from "@/services/user/user.service";
import { AppError } from "@/utils/error/appError";

/**
 * Get all badges
 */
export const getAllBadges = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { category, rarity, isActive } = req.query;

  const badges = await getAllBadgesS({
    category: category as string,
    rarity: rarity as string,
    isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
  });

  res.status(200).json({
    message: "Badges retrieved successfully",
    data: badges,
  });
};

/**
 * Get badge by ID
 */
export const getBadgeById = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { badgeId } = req.params;

  if (!badgeId) {
    throw new AppError("Badge ID is required", 400);
  }

  const badge = await getBadgeByIdS(badgeId);

  if (!badge) {
    throw new AppError("Badge not found", 404);
  }

  res.status(200).json({
    message: "Badge retrieved successfully",
    data: badge,
  });
};

/**
 * Get user's badges
 */
export const getUserBadges = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (!req.account) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await findOrCreateUserS(req.account._id.toString());
  const badges = await getUserBadgesS(user._id);

  res.status(200).json({
    message: "User badges retrieved successfully",
    data: badges,
  });
};

/**
 * Create badge (admin only)
 */
export const createBadge = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  // TODO: Add admin check
  // if (!req.account?.isAdmin) {
  //   throw new AppError("Admin access required", 403);
  // }

  const { name, description, icon, rarity, category, condition, xpBonus, isActive } = req.body;

  if (!name || !description || !icon || !category) {
    throw new AppError("Name, description, icon, and category are required", 400);
  }

  const badge = await createBadgeS({
    name,
    description,
    icon,
    rarity: rarity || "common",
    category,
    condition,
    xpBonus: xpBonus || 0,
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json({
    message: "Badge created successfully",
    data: badge,
  });
};

