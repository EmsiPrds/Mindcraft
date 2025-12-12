import User from "@/models/user.model";
import Account from "@/models/account.model";
import Challenge from "@/models/challenge.model";
import Submission from "@/models/submission.model";
import SkillPath from "@/models/skillPath.model";
import Badge from "@/models/badge.model";
import Achievement from "@/models/achievement.model";
import { AppError } from "@/utils/error/appError";

/**
 * Get platform analytics
 */
export const getPlatformAnalyticsS = async (): Promise<{
  users: {
    total: number;
    active: number; // Users who completed a challenge in last 30 days
    new: number; // Users created in last 30 days
  };
  challenges: {
    total: number;
    active: number;
    completed: number; // Total submissions
  };
  submissions: {
    total: number;
    completed: number;
    reviewed: number;
    pending: number;
  };
  skillPaths: {
    total: number;
    active: number;
  };
  gamification: {
    totalXP: number;
    totalCoins: number;
    badgesAwarded: number;
    achievementsUnlocked: number;
  };
  recentActivity: {
    newUsers: number;
    completedChallenges: number;
    newSubmissions: number;
  };
}> => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // User stats
  const totalUsers = await User.countDocuments({}).exec();
  const activeUsers = await User.countDocuments({
    lastChallengeDate: { $gte: thirtyDaysAgo },
  }).exec();
  const newUsers = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  }).exec();

  // Challenge stats
  const totalChallenges = await Challenge.countDocuments({}).exec();
  const activeChallenges = await Challenge.countDocuments({ isActive: true }).exec();
  const completedSubmissions = await Submission.countDocuments({
    status: { $in: ["completed", "reviewed"] },
  }).exec();

  // Submission stats
  const totalSubmissions = await Submission.countDocuments({}).exec();
  const completedSubmissionsCount = await Submission.countDocuments({
    status: "completed",
  }).exec();
  const reviewedSubmissions = await Submission.countDocuments({
    status: "reviewed",
  }).exec();
  const pendingSubmissions = await Submission.countDocuments({
    status: "pending",
  }).exec();

  // Skill path stats
  const totalSkillPaths = await SkillPath.countDocuments({}).exec();
  const activeSkillPaths = await SkillPath.countDocuments({ isActive: true }).exec();

  // Gamification stats
  const users = await User.find({}).exec();
  const totalXP = users.reduce((sum, u) => sum + u.xp, 0);
  const totalCoins = users.reduce((sum, u) => sum + u.coins, 0);
  const badgesAwarded = users.reduce((sum, u) => sum + u.badges.length, 0);
  const achievementsUnlocked = users.reduce((sum, u) => sum + u.achievements.length, 0);

  // Recent activity (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const newUsersRecent = await User.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  }).exec();
  const completedChallengesRecent = await Submission.countDocuments({
    status: { $in: ["completed", "reviewed"] },
    completedAt: { $gte: sevenDaysAgo },
  }).exec();
  const newSubmissionsRecent = await Submission.countDocuments({
    submittedAt: { $gte: sevenDaysAgo },
  }).exec();

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      new: newUsers,
    },
    challenges: {
      total: totalChallenges,
      active: activeChallenges,
      completed: completedSubmissions,
    },
    submissions: {
      total: totalSubmissions,
      completed: completedSubmissionsCount,
      reviewed: reviewedSubmissions,
      pending: pendingSubmissions,
    },
    skillPaths: {
      total: totalSkillPaths,
      active: activeSkillPaths,
    },
    gamification: {
      totalXP,
      totalCoins,
      badgesAwarded,
      achievementsUnlocked,
    },
    recentActivity: {
      newUsers: newUsersRecent,
      completedChallenges: completedChallengesRecent,
      newSubmissions: newSubmissionsRecent,
    },
  };
};

/**
 * Get all users (admin)
 */
export const getAllUsersS = async (filters?: {
  limit?: number;
  skip?: number;
  search?: string;
}): Promise<{ users: any[]; total: number }> => {
  const limit = filters?.limit || 50;
  const skip = filters?.skip || 0;

  let query: any = {};

  // Search by username or email
  if (filters?.search) {
    const accounts = await Account.find({
      $or: [
        { username: { $regex: filters.search, $options: "i" } },
        { email: { $regex: filters.search, $options: "i" } },
      ],
    }).exec();

    const accountIds = accounts.map((a) => a._id);
    query.accountId = { $in: accountIds };
  }

  const total = await User.countDocuments(query).exec();
  const users = await User.find(query)
    .populate("accountId", "username firstName lastName email")
    .populate("selectedSkillPath")
    .populate("badges")
    .populate("achievements")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .exec();

  return {
    users: users.map((u) => u.toObject()),
    total,
  };
};

/**
 * Get user details (admin)
 */
export const getUserDetailsS = async (userId: string): Promise<any> => {
  const user = await User.findById(userId)
    .populate("accountId")
    .populate("selectedSkillPath")
    .populate("badges")
    .populate("achievements")
    .exec();

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Get submission stats
  const submissions = await Submission.find({ userId: user._id }).exec();
  const portfolioCount = submissions.filter((s) => s.showInPortfolio).length;

  return {
    ...user.toObject(),
    submissionStats: {
      total: submissions.length,
      portfolio: portfolioCount,
      byStatus: {
        pending: submissions.filter((s) => s.status === "pending").length,
        completed: submissions.filter((s) => s.status === "completed").length,
        reviewed: submissions.filter((s) => s.status === "reviewed").length,
      },
    },
  };
};

/**
 * Update user (admin)
 */
export const updateUserS = async (
  userId: string,
  updates: any
): Promise<any> => {
  const user = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true })
    .populate("accountId")
    .populate("selectedSkillPath")
    .exec();

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user.toObject();
};

/**
 * Delete user (admin)
 */
export const deleteUserS = async (userId: string): Promise<boolean> => {
  const user = await User.findById(userId).exec();
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Delete user's submissions
  await Submission.deleteMany({ userId: user._id }).exec();

  // Delete user profile
  await User.findByIdAndDelete(userId).exec();

  // Optionally delete account (or keep for audit)
  // await Account.findByIdAndDelete(user.accountId).exec();

  return true;
};

/**
 * Get admin dashboard stats
 */
export const getAdminDashboardStatsS = async (): Promise<{
  overview: any;
  topUsers: any[];
  recentSubmissions: any[];
  skillPathStats: any[];
}> => {
  const analytics = await getPlatformAnalyticsS();

  // Get top 10 users by XP
  const topUsers = await User.find({})
    .sort({ xp: -1 })
    .limit(10)
    .populate("accountId", "username firstName lastName")
    .exec();

  // Get recent submissions
  const recentSubmissions = await Submission.find({})
    .sort({ submittedAt: -1 })
    .limit(10)
    .populate("userId", "accountId")
    .populate("challengeId")
    .populate("skillPathId")
    .exec();

  // Get skill path stats
  const skillPaths = await SkillPath.find({ isActive: true }).exec();
  const skillPathStats = await Promise.all(
    skillPaths.map(async (path) => {
      const completed = await Submission.countDocuments({
        skillPathId: path._id,
        status: { $in: ["completed", "reviewed"] },
      }).exec();
      const users = await Submission.distinct("userId", {
        skillPathId: path._id,
        status: { $in: ["completed", "reviewed"] },
      }).exec();

      return {
        skillPath: path.toObject(),
        completed,
        totalChallenges: path.totalChallenges,
        activeUsers: users.length,
      };
    })
  );

  return {
    overview: analytics,
    topUsers: topUsers.map((u) => ({
      ...u.toObject(),
      account: (u.accountId as any)?.toObject(),
    })),
    recentSubmissions: recentSubmissions.map((s) => s.toObject()),
    skillPathStats,
  };
};

