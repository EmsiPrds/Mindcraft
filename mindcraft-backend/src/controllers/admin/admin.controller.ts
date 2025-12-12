import type { CustomRequest, Response } from "@/types/express/express.type";
import {
  getPlatformAnalyticsS,
  getAllUsersS,
  getUserDetailsS,
  updateUserS,
  deleteUserS,
  getAdminDashboardStatsS,
} from "@/services/admin/admin.service";
import { AppError } from "@/utils/error/appError";

/**
 * Get platform analytics
 */
export const getPlatformAnalytics = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  // TODO: Add admin check
  // if (!req.account?.isAdmin) {
  //   throw new AppError("Admin access required", 403);
  // }

  const analytics = await getPlatformAnalyticsS();

  res.status(200).json({
    message: "Analytics retrieved successfully",
    data: analytics,
  });
};

/**
 * Get admin dashboard stats
 */
export const getAdminDashboardStats = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  // TODO: Add admin check
  // if (!req.account?.isAdmin) {
  //   throw new AppError("Admin access required", 403);
  // }

  const stats = await getAdminDashboardStatsS();

  res.status(200).json({
    message: "Dashboard stats retrieved successfully",
    data: stats,
  });
};

/**
 * Get all users (admin)
 */
export const getAllUsers = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  // TODO: Add admin check
  // if (!req.account?.isAdmin) {
  //   throw new AppError("Admin access required", 403);
  // }

  const { limit, skip, search } = req.query;

  const result = await getAllUsersS({
    limit: limit ? parseInt(limit as string) : undefined,
    skip: skip ? parseInt(skip as string) : undefined,
    search: search as string,
  });

  res.status(200).json({
    message: "Users retrieved successfully",
    data: result,
  });
};

/**
 * Get user details (admin)
 */
export const getUserDetails = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  // TODO: Add admin check
  // if (!req.account?.isAdmin) {
  //   throw new AppError("Admin access required", 403);
  // }

  const { userId } = req.params;

  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  const user = await getUserDetailsS(userId);

  res.status(200).json({
    message: "User details retrieved successfully",
    data: user,
  });
};

/**
 * Update user (admin)
 */
export const updateUser = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  // TODO: Add admin check
  // if (!req.account?.isAdmin) {
  //   throw new AppError("Admin access required", 403);
  // }

  const { userId } = req.params;
  const updates = req.body;

  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  const user = await updateUserS(userId, updates);

  res.status(200).json({
    message: "User updated successfully",
    data: user,
  });
};

/**
 * Delete user (admin)
 */
export const deleteUser = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  // TODO: Add admin check
  // if (!req.account?.isAdmin) {
  //   throw new AppError("Admin access required", 403);
  // }

  const { userId } = req.params;

  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  await deleteUserS(userId);

  res.status(200).json({
    message: "User deleted successfully",
  });
};

