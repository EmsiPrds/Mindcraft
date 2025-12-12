import User from "@/models/user.model";
import Submission from "@/models/submission.model";
import Account from "@/models/account.model";
import { AppError } from "@/utils/error/appError";

export type LeaderboardEntry = {
  rank: number;
  user: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  stats: {
    xp: number;
    level: number;
    coins: number;
    currentStreak: number;
    longestStreak: number;
    completedChallenges: number;
  };
};

export type SkillPathLeaderboardEntry = LeaderboardEntry & {
  skillPathStats: {
    skillPathId: string;
    skillPathName: string;
    completed: number;
    total: number;
    totalXP: number;
  };
};

/**
 * Get global leaderboard by XP
 */
export const getGlobalLeaderboardByXP = async (options?: {
  limit?: number;
  skip?: number;
}): Promise<{ entries: LeaderboardEntry[]; total: number }> => {
  const limit = options?.limit || 100;
  const skip = options?.skip || 0;

  // Get users sorted by XP
  const users = await User.find({})
    .sort({ xp: -1, level: -1, currentStreak: -1 })
    .limit(limit)
    .skip(skip)
    .populate("accountId", "username firstName lastName email")
    .exec();

  const total = await User.countDocuments({}).exec();

  const entries: LeaderboardEntry[] = users.map((user, index) => {
    const account = user.accountId as any;
    return {
      rank: skip + index + 1,
      user: {
        _id: user._id.toString(),
        username: account?.username || "Unknown",
        firstName: account?.firstName || "",
        lastName: account?.lastName || "",
        email: account?.email || "",
      },
      stats: {
        xp: user.xp,
        level: user.level,
        coins: user.coins,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        completedChallenges: user.completedChallenges,
      },
    };
  });

  return { entries, total };
};

/**
 * Get global leaderboard by streak
 */
export const getGlobalLeaderboardByStreak = async (options?: {
  limit?: number;
  skip?: number;
}): Promise<{ entries: LeaderboardEntry[]; total: number }> => {
  const limit = options?.limit || 100;
  const skip = options?.skip || 0;

  // Get users sorted by current streak
  const users = await User.find({})
    .sort({ currentStreak: -1, longestStreak: -1, xp: -1 })
    .limit(limit)
    .skip(skip)
    .populate("accountId", "username firstName lastName email")
    .exec();

  const total = await User.countDocuments({}).exec();

  const entries: LeaderboardEntry[] = users.map((user, index) => {
    const account = user.accountId as any;
    return {
      rank: skip + index + 1,
      user: {
        _id: user._id.toString(),
        username: account?.username || "Unknown",
        firstName: account?.firstName || "",
        lastName: account?.lastName || "",
        email: account?.email || "",
      },
      stats: {
        xp: user.xp,
        level: user.level,
        coins: user.coins,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        completedChallenges: user.completedChallenges,
      },
    };
  });

  return { entries, total };
};

/**
 * Get global leaderboard by level
 */
export const getGlobalLeaderboardByLevel = async (options?: {
  limit?: number;
  skip?: number;
}): Promise<{ entries: LeaderboardEntry[]; total: number }> => {
  const limit = options?.limit || 100;
  const skip = options?.skip || 0;

  // Get users sorted by level, then XP
  const users = await User.find({})
    .sort({ level: -1, xp: -1, currentStreak: -1 })
    .limit(limit)
    .skip(skip)
    .populate("accountId", "username firstName lastName email")
    .exec();

  const total = await User.countDocuments({}).exec();

  const entries: LeaderboardEntry[] = users.map((user, index) => {
    const account = user.accountId as any;
    return {
      rank: skip + index + 1,
      user: {
        _id: user._id.toString(),
        username: account?.username || "Unknown",
        firstName: account?.firstName || "",
        lastName: account?.lastName || "",
        email: account?.email || "",
      },
      stats: {
        xp: user.xp,
        level: user.level,
        coins: user.coins,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        completedChallenges: user.completedChallenges,
      },
    };
  });

  return { entries, total };
};

/**
 * Get skill path leaderboard
 */
export const getSkillPathLeaderboard = async (
  skillPathId: string,
  options?: {
    limit?: number;
    skip?: number;
  }
): Promise<{ entries: SkillPathLeaderboardEntry[]; total: number }> => {
  const limit = options?.limit || 100;
  const skip = options?.skip || 0;

  // Get skill path name
  const SkillPath = (await import("@/models/skillPath.model")).default;
  const skillPath = await SkillPath.findById(skillPathId).exec();
  if (!skillPath) {
    throw new AppError("Skill path not found", 404);
  }

  // Get all users who have submissions in this skill path
  const submissions = await Submission.aggregate([
    {
      $match: {
        skillPathId: skillPathId as any,
        status: { $in: ["completed", "reviewed"] },
      },
    },
    {
      $group: {
        _id: "$userId",
        completed: { $sum: 1 },
        totalXP: { $sum: "$xpEarned" },
      },
    },
    {
      $sort: { totalXP: -1, completed: -1 },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]).exec();

  // Get total unique users
  const totalResult = await Submission.aggregate([
    {
      $match: {
        skillPathId: skillPathId as any,
        status: { $in: ["completed", "reviewed"] },
      },
    },
    {
      $group: {
        _id: "$userId",
      },
    },
    {
      $count: "total",
    },
  ]).exec();

  const total = totalResult[0]?.total || 0;

  // Get user details and stats
  const userIds = submissions.map((s) => s._id);
  const users = await User.find({ _id: { $in: userIds } })
    .populate("accountId", "username firstName lastName email")
    .exec();

  // Get total challenges in skill path
  const Challenge = (await import("@/models/challenge.model")).default;
  const totalChallenges = await Challenge.countDocuments({
    skillPathId,
    isActive: true,
  }).exec();

  // Build entries
  const entries: SkillPathLeaderboardEntry[] = submissions.map((sub, index) => {
    const user = users.find((u) => u._id.toString() === sub._id.toString());
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const account = user.accountId as any;
    return {
      rank: skip + index + 1,
      user: {
        _id: user._id.toString(),
        username: account?.username || "Unknown",
        firstName: account?.firstName || "",
        lastName: account?.lastName || "",
        email: account?.email || "",
      },
      stats: {
        xp: user.xp,
        level: user.level,
        coins: user.coins,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        completedChallenges: user.completedChallenges,
      },
      skillPathStats: {
        skillPathId: skillPathId,
        skillPathName: skillPath.name,
        completed: sub.completed,
        total: totalChallenges,
        totalXP: sub.totalXP,
      },
    };
  });

  return { entries, total };
};

/**
 * Get user's rank in global leaderboard
 */
export const getUserGlobalRank = async (
  accountId: string,
  sortBy: "xp" | "streak" | "level" = "xp"
): Promise<{
  rank: number;
  total: number;
  user: LeaderboardEntry;
}> => {
  const user = await User.findOne({ accountId })
    .populate("accountId", "username firstName lastName email")
    .exec();

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Determine sort field
  let sortField: string;
  switch (sortBy) {
    case "streak":
      sortField = "currentStreak";
      break;
    case "level":
      sortField = "level";
      break;
    default:
      sortField = "xp";
  }

  // Count users with better stats
  let rank = 1;

  if (sortBy === "xp") {
    rank = (await User.countDocuments({
      $or: [
        { xp: { $gt: user.xp } },
        { xp: user.xp, level: { $gt: user.level } },
        { xp: user.xp, level: user.level, currentStreak: { $gt: user.currentStreak } },
      ],
    }).exec()) + 1;
  } else if (sortBy === "level") {
    rank = (await User.countDocuments({
      $or: [
        { level: { $gt: user.level } },
        { level: user.level, xp: { $gt: user.xp } },
        { level: user.level, xp: user.xp, currentStreak: { $gt: user.currentStreak } },
      ],
    }).exec()) + 1;
  } else if (sortBy === "streak") {
    rank = (await User.countDocuments({
      $or: [
        { currentStreak: { $gt: user.currentStreak } },
        { currentStreak: user.currentStreak, longestStreak: { $gt: user.longestStreak } },
        {
          currentStreak: user.currentStreak,
          longestStreak: user.longestStreak,
          xp: { $gt: user.xp },
        },
      ],
    }).exec()) + 1;
  }

  const total = await User.countDocuments({}).exec();

  const account = user.accountId as any;
  const userEntry: LeaderboardEntry = {
    rank,
    user: {
      _id: user._id.toString(),
      username: account?.username || "Unknown",
      firstName: account?.firstName || "",
      lastName: account?.lastName || "",
      email: account?.email || "",
    },
    stats: {
      xp: user.xp,
      level: user.level,
      coins: user.coins,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      completedChallenges: user.completedChallenges,
    },
  };

  return { rank, total, user: userEntry };
};

/**
 * Get user's rank in skill path leaderboard
 */
export const getUserSkillPathRank = async (
  accountId: string,
  skillPathId: string
): Promise<{
  rank: number;
  total: number;
  user: SkillPathLeaderboardEntry;
}> => {
  const user = await User.findOne({ accountId })
    .populate("accountId", "username firstName lastName email")
    .exec();

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Get user's submissions in this skill path
  const userSubmissions = await Submission.find({
    userId: user._id,
    skillPathId,
    status: { $in: ["completed", "reviewed"] },
  }).exec();

  const userTotalXP = userSubmissions.reduce((sum, s) => sum + s.xpEarned, 0);
  const userCompleted = userSubmissions.length;

  // Count users with better stats
  const betterUsers = await Submission.aggregate([
    {
      $match: {
        skillPathId: skillPathId as any,
        status: { $in: ["completed", "reviewed"] },
      },
    },
    {
      $group: {
        _id: "$userId",
        totalXP: { $sum: "$xpEarned" },
        completed: { $sum: 1 },
      },
    },
    {
      $match: {
        $or: [
          { totalXP: { $gt: userTotalXP } },
          { totalXP: userTotalXP, completed: { $gt: userCompleted } },
        ],
      },
    },
    {
      $count: "total",
    },
  ]).exec();

  const rank = (betterUsers[0]?.total || 0) + 1;

  // Get total users
  const totalResult = await Submission.aggregate([
    {
      $match: {
        skillPathId: skillPathId as any,
        status: { $in: ["completed", "reviewed"] },
      },
    },
    {
      $group: {
        _id: "$userId",
      },
    },
    {
      $count: "total",
    },
  ]).exec();

  const total = totalResult[0]?.total || 0;

  // Get skill path details
  const SkillPath = (await import("@/models/skillPath.model")).default;
  const skillPath = await SkillPath.findById(skillPathId).exec();
  if (!skillPath) {
    throw new AppError("Skill path not found", 404);
  }

  const Challenge = (await import("@/models/challenge.model")).default;
  const totalChallenges = await Challenge.countDocuments({
    skillPathId,
    isActive: true,
  }).exec();

  const account = user.accountId as any;
  const userEntry: SkillPathLeaderboardEntry = {
    rank,
    user: {
      _id: user._id.toString(),
      username: account?.username || "Unknown",
      firstName: account?.firstName || "",
      lastName: account?.lastName || "",
      email: account?.email || "",
    },
    stats: {
      xp: user.xp,
      level: user.level,
      coins: user.coins,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      completedChallenges: user.completedChallenges,
    },
    skillPathStats: {
      skillPathId: skillPathId,
      skillPathName: skillPath.name,
      completed: userCompleted,
      total: totalChallenges,
      totalXP: userTotalXP,
    },
  };

  return { rank, total, user: userEntry };
};

