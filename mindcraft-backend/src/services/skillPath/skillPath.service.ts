import SkillPath from "@/models/skillPath.model";
import { SkillPathType } from "@/types/models/skillPath.type";
import { AppError } from "@/utils/error/appError";
import Challenge from "@/models/challenge.model";
import Submission from "@/models/submission.model";
import User from "@/models/user.model";

/**
 * Create a new skill path
 */
export const createSkillPathS = async (
  skillPathData: Omit<SkillPathType, "_id" | "createdAt" | "updatedAt">
): Promise<SkillPathType> => {
  const skillPath = await SkillPath.create(skillPathData);
  
  // Update total challenges count
  const challengeCount = await Challenge.countDocuments({
    skillPathId: skillPath._id,
    isActive: true,
  }).exec();
  
  skillPath.totalChallenges = challengeCount;
  await skillPath.save();
  
  return skillPath.toObject() as SkillPathType;
};

/**
 * Get skill path by ID
 */
export const getSkillPathByIdS = async (
  skillPathId: string
): Promise<SkillPathType | null> => {
  const skillPath = await SkillPath.findById(skillPathId).exec();
  if (!skillPath) return null;
  return skillPath.toObject() as SkillPathType;
};

/**
 * Get all skill paths
 */
export const getAllSkillPathsS = async (filters?: {
  isActive?: boolean;
  difficulty?: string;
}): Promise<SkillPathType[]> => {
  const query: any = {};
  
  if (filters?.isActive !== undefined) {
    query.isActive = filters.isActive;
  }
  if (filters?.difficulty) {
    query.difficulty = filters.difficulty;
  }

  const skillPaths = await SkillPath.find(query)
    .sort({ order: 1, name: 1 })
    .exec();
  
  return skillPaths.map((sp) => sp.toObject() as SkillPathType);
};

/**
 * Update skill path
 */
export const updateSkillPathS = async (
  skillPathId: string,
  updates: Partial<SkillPathType>
): Promise<SkillPathType | null> => {
  const skillPath = await SkillPath.findByIdAndUpdate(
    skillPathId,
    { $set: updates },
    { new: true }
  ).exec();

  if (!skillPath) return null;

  // Update total challenges count if needed
  if (updates.isActive !== undefined) {
    const challengeCount = await Challenge.countDocuments({
      skillPathId: skillPath._id,
      isActive: true,
    }).exec();
    skillPath.totalChallenges = challengeCount;
    await skillPath.save();
  }

  return skillPath.toObject() as SkillPathType;
};

/**
 * Delete skill path (soft delete)
 */
export const deleteSkillPathS = async (
  skillPathId: string
): Promise<boolean> => {
  const result = await SkillPath.findByIdAndUpdate(
    skillPathId,
    { $set: { isActive: false } },
    { new: true }
  ).exec();

  return !!result;
};

/**
 * Select skill path for user
 */
export const selectSkillPathForUserS = async (
  accountId: string,
  skillPathId: string
): Promise<{ user: any; skillPath: SkillPathType }> => {
  const user = await User.findOne({ accountId }).exec();
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const skillPath = await getSkillPathByIdS(skillPathId);
  if (!skillPath) {
    throw new AppError("Skill path not found", 404);
  }

  if (!skillPath.isActive) {
    throw new AppError("Skill path is not active", 400);
  }

  user.selectedSkillPath = skillPathId as any;
  await user.save();

  return {
    user: user.toObject(),
    skillPath,
  };
};

/**
 * Get user's skill path progress
 */
export const getUserSkillPathProgressS = async (
  accountId: string,
  skillPathId: string
): Promise<{
  skillPath: SkillPathType;
  progress: {
    completed: number;
    total: number;
    percentage: number;
    currentDay: number;
    nextChallenge?: any;
  };
  stats: {
    totalXP: number;
    totalCoins: number;
    averageRating?: number;
  };
}> => {
  const user = await User.findOne({ accountId }).exec();
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const skillPath = await getSkillPathByIdS(skillPathId);
  if (!skillPath) {
    throw new AppError("Skill path not found", 404);
  }

  // Get completed challenges in this path
  const completedSubmissions = await Submission.find({
    userId: user._id,
    skillPathId,
    status: { $in: ["completed", "reviewed"] },
  }).exec();

  const completed = completedSubmissions.length;
  const total = skillPath.totalChallenges || 0;
  const percentage = total > 0 ? Math.floor((completed / total) * 100) : 0;
  const currentDay = completed + 1;

  // Get next challenge
  const nextChallenge = await Challenge.findOne({
    skillPathId,
    dayNumber: currentDay,
    isActive: true,
  })
    .populate("skillPathId")
    .exec();

  // Calculate stats
  const totalXP = completedSubmissions.reduce((sum, s) => sum + s.xpEarned, 0);
  const totalCoins = completedSubmissions.reduce((sum, s) => sum + s.coinsEarned, 0);
  
  const ratedSubmissions = completedSubmissions.filter((s) => s.rating);
  const averageRating =
    ratedSubmissions.length > 0
      ? ratedSubmissions.reduce((sum, s) => sum + (s.rating || 0), 0) / ratedSubmissions.length
      : undefined;

  return {
    skillPath,
    progress: {
      completed,
      total,
      percentage,
      currentDay,
      nextChallenge: nextChallenge ? nextChallenge.toObject() : undefined,
    },
    stats: {
      totalXP,
      totalCoins,
      averageRating,
    },
  };
};

/**
 * Get all user's skill path progress
 */
export const getAllUserSkillPathProgressS = async (
  accountId: string
): Promise<Array<{
  skillPath: SkillPathType;
  progress: {
    completed: number;
    total: number;
    percentage: number;
    currentDay: number;
  };
}>> => {
  const user = await User.findOne({ accountId }).exec();
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const skillPaths = await SkillPath.find({ isActive: true }).exec();
  const progressList = [];

  for (const skillPath of skillPaths) {
    const completed = await Submission.countDocuments({
      userId: user._id,
      skillPathId: skillPath._id,
      status: { $in: ["completed", "reviewed"] },
    }).exec();

    const total = skillPath.totalChallenges || 0;
    const percentage = total > 0 ? Math.floor((completed / total) * 100) : 0;
    const currentDay = completed + 1;

    progressList.push({
      skillPath: skillPath.toObject() as SkillPathType,
      progress: {
        completed,
        total,
        percentage,
        currentDay,
      },
    });
  }

  return progressList;
};

/**
 * Get user's current skill path
 */
export const getUserCurrentSkillPathS = async (
  accountId: string
): Promise<{
  skillPath: SkillPathType | null;
  progress: {
    completed: number;
    total: number;
    percentage: number;
    currentDay: number;
    nextChallenge?: any;
  } | null;
}> => {
  const user = await User.findOne({ accountId })
    .populate("selectedSkillPath")
    .exec();
  
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.selectedSkillPath) {
    return {
      skillPath: null,
      progress: null,
    };
  }

  const skillPath = user.selectedSkillPath as any;
  const skillPathId = skillPath._id.toString();

  // Get completed challenges
  const completed = await Submission.countDocuments({
    userId: user._id,
    skillPathId,
    status: { $in: ["completed", "reviewed"] },
  }).exec();

  const total = skillPath.totalChallenges || 0;
  const percentage = total > 0 ? Math.floor((completed / total) * 100) : 0;
  const currentDay = completed + 1;

  // Get next challenge
  const nextChallenge = await Challenge.findOne({
    skillPathId,
    dayNumber: currentDay,
    isActive: true,
  })
    .populate("skillPathId")
    .exec();

  return {
    skillPath: skillPath.toObject() as SkillPathType,
    progress: {
      completed,
      total,
      percentage,
      currentDay,
      nextChallenge: nextChallenge ? nextChallenge.toObject() : undefined,
    },
  };
};

/**
 * Update skill path challenge count
 */
export const updateSkillPathChallengeCountS = async (
  skillPathId: string
): Promise<void> => {
  const count = await Challenge.countDocuments({
    skillPathId,
    isActive: true,
  }).exec();

  await SkillPath.findByIdAndUpdate(skillPathId, {
    $set: { totalChallenges: count },
  }).exec();
};

