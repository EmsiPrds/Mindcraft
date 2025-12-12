import type { CustomRequest, Response } from "@/types/express/express.type";
import {
  createSkillPathS,
  getAllSkillPathsS,
  getSkillPathByIdS,
  updateSkillPathS,
  deleteSkillPathS,
  selectSkillPathForUserS,
  getUserSkillPathProgressS,
  getAllUserSkillPathProgressS,
  getUserCurrentSkillPathS,
} from "@/services/skillPath/skillPath.service";
import { AppError } from "@/utils/error/appError";

/**
 * Get all skill paths
 */
export const getAllSkillPaths = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { isActive, difficulty } = req.query;

  const skillPaths = await getAllSkillPathsS({
    isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
    difficulty: difficulty as string,
  });

  res.status(200).json({
    message: "Skill paths retrieved successfully",
    data: skillPaths,
  });
};

/**
 * Get skill path by ID
 */
export const getSkillPathById = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { skillPathId } = req.params;

  if (!skillPathId) {
    throw new AppError("Skill path ID is required", 400);
  }

  const skillPath = await getSkillPathByIdS(skillPathId);

  if (!skillPath) {
    throw new AppError("Skill path not found", 404);
  }

  res.status(200).json({
    message: "Skill path retrieved successfully",
    data: skillPath,
  });
};

/**
 * Get user's current skill path
 */
export const getUserCurrentSkillPath = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (!req.account) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await getUserCurrentSkillPathS(req.account._id.toString());

  res.status(200).json({
    message: "Current skill path retrieved successfully",
    data: result,
  });
};

/**
 * Get all user's skill path progress
 */
export const getAllUserSkillPathProgress = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (!req.account) {
    throw new AppError("Unauthorized", 401);
  }

  const progress = await getAllUserSkillPathProgressS(req.account._id.toString());

  res.status(200).json({
    message: "Skill path progress retrieved successfully",
    data: progress,
  });
};

/**
 * Get user's progress for a specific skill path
 */
export const getUserSkillPathProgress = async (
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

  const result = await getUserSkillPathProgressS(
    req.account._id.toString(),
    skillPathId
  );

  res.status(200).json({
    message: "Skill path progress retrieved successfully",
    data: result,
  });
};

/**
 * Select skill path for user
 */
export const selectSkillPath = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (!req.account) {
    throw new AppError("Unauthorized", 401);
  }

  const { skillPathId } = req.body;

  if (!skillPathId) {
    throw new AppError("Skill path ID is required", 400);
  }

  const result = await selectSkillPathForUserS(
    req.account._id.toString(),
    skillPathId
  );

  res.status(200).json({
    message: "Skill path selected successfully",
    data: result,
  });
};

/**
 * Create skill path (admin only)
 */
export const createSkillPath = async (
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
    color,
    difficulty,
    estimatedDuration,
    isActive,
    order,
  } = req.body;

  if (!name || !description || !difficulty) {
    throw new AppError("Name, description, and difficulty are required", 400);
  }

  const skillPath = await createSkillPathS({
    name,
    description,
    icon,
    color: color || "#6366f1",
    difficulty,
    estimatedDuration,
    isActive: isActive !== undefined ? isActive : true,
    order: order || 0,
    totalChallenges: 0, // Will be calculated
  });

  res.status(201).json({
    message: "Skill path created successfully",
    data: skillPath,
  });
};

/**
 * Update skill path (admin only)
 */
export const updateSkillPath = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  // TODO: Add admin check
  // if (!req.account?.isAdmin) {
  //   throw new AppError("Admin access required", 403);
  // }

  const { skillPathId } = req.params;
  const updates = req.body;

  if (!skillPathId) {
    throw new AppError("Skill path ID is required", 400);
  }

  const skillPath = await updateSkillPathS(skillPathId, updates);

  if (!skillPath) {
    throw new AppError("Skill path not found", 404);
  }

  res.status(200).json({
    message: "Skill path updated successfully",
    data: skillPath,
  });
};

/**
 * Delete skill path (admin only - soft delete)
 */
export const deleteSkillPath = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  // TODO: Add admin check
  // if (!req.account?.isAdmin) {
  //   throw new AppError("Admin access required", 403);
  // }

  const { skillPathId } = req.params;

  if (!skillPathId) {
    throw new AppError("Skill path ID is required", 400);
  }

  const deleted = await deleteSkillPathS(skillPathId);

  if (!deleted) {
    throw new AppError("Skill path not found", 404);
  }

  res.status(200).json({
    message: "Skill path deleted successfully",
  });
};

