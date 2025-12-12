import Achievement from "@/models/achievement.model";
import { AchievementType } from "@/types/models/achievement.type";
import { AppError } from "@/utils/error/appError";
import User from "@/models/user.model";
import Submission from "@/models/submission.model";

/**
 * Create a new achievement
 */
export const createAchievementS = async (
  achievementData: Omit<AchievementType, "_id" | "createdAt" | "updatedAt">
): Promise<AchievementType> => {
  const achievement = await Achievement.create(achievementData);
  return achievement.toObject() as AchievementType;
};

/**
 * Get achievement by ID
 */
export const getAchievementByIdS = async (
  achievementId: string
): Promise<AchievementType | null> => {
  const achievement = await Achievement.findById(achievementId).exec();
  if (!achievement) return null;
  return achievement.toObject() as AchievementType;
};

/**
 * Get all achievements
 */
export const getAllAchievementsS = async (filters?: {
  category?: string;
  isActive?: boolean;
}): Promise<AchievementType[]> => {
  const query: any = {};
  
  if (filters?.category) query.category = filters.category;
  if (filters?.isActive !== undefined) query.isActive = filters.isActive;

  const achievements = await Achievement.find(query).sort({ category: 1, name: 1 }).exec();
  return achievements.map((a) => a.toObject() as AchievementType);
};

/**
 * Get user's achievements
 */
export const getUserAchievementsS = async (userId: string): Promise<AchievementType[]> => {
  const user = await User.findById(userId).populate("achievements").exec();
  
  if (!user || !user.achievements) return [];
  return (user.achievements as any[]).map((a) => a.toObject() as AchievementType);
};

/**
 * Award achievement to user
 */
export const awardAchievementToUserS = async (
  userId: string,
  achievementId: string
): Promise<{ awarded: boolean; achievement?: AchievementType }> => {
  const user = await User.findById(userId).exec();
  
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Check if user already has this achievement
  if (user.achievements.includes(achievementId as any)) {
    return { awarded: false };
  }

  // Get achievement details
  const achievement = await getAchievementByIdS(achievementId);
  if (!achievement) {
    throw new AppError("Achievement not found", 404);
  }

  // Add achievement to user
  user.achievements.push(achievementId as any);
  
  // Add rewards
  if (achievement.xpReward > 0) {
    const { addXPToUserS } = await import("@/services/user/user.service");
    await addXPToUserS(user.accountId.toString(), achievement.xpReward);
  }
  
  if (achievement.coinReward > 0) {
    const { addCoinsToUserS } = await import("@/services/user/user.service");
    await addCoinsToUserS(user.accountId.toString(), achievement.coinReward);
  }

  await user.save();

  return { awarded: true, achievement };
};

/**
 * Check and unlock achievements for a user
 */
export const checkAchievementsS = async (userId: string): Promise<AchievementType[]> => {
  const user = await User.findById(userId).exec();
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Get all active achievements
  const achievements = await Achievement.find({ isActive: true }).exec();
  const unlockedAchievements: AchievementType[] = [];

  for (const achievement of achievements) {
    // Skip if user already has this achievement
    if (user.achievements.includes(achievement._id as any)) {
      continue;
    }

    let shouldUnlock = false;

    switch (achievement.requirement.type) {
      case "complete_challenges":
        shouldUnlock = user.completedChallenges >= achievement.requirement.value;
        break;

      case "reach_level":
        shouldUnlock = user.level >= achievement.requirement.value;
        break;

      case "maintain_streak":
        shouldUnlock = user.currentStreak >= achievement.requirement.value;
        break;

      case "earn_xp":
        shouldUnlock = user.xp >= achievement.requirement.value;
        break;

      case "complete_skill_path":
        if (achievement.requirement.skillPathId) {
          const completedInPath = await Submission.countDocuments({
            userId: user._id,
            skillPathId: achievement.requirement.skillPathId,
            status: { $in: ["completed", "reviewed"] },
          }).exec();
          shouldUnlock = completedInPath >= achievement.requirement.value;
        }
        break;

      case "earn_coins":
        shouldUnlock = user.coins >= achievement.requirement.value;
        break;

      default:
        break;
    }

    if (shouldUnlock) {
      const result = await awardAchievementToUserS(userId, achievement._id.toString());
      if (result.awarded && result.achievement) {
        unlockedAchievements.push(result.achievement);
      }
    }
  }

  return unlockedAchievements;
};

/**
 * Check achievements after challenge completion
 */
export const checkAchievementsAfterCompletionS = async (
  userId: string,
  skillPathId?: string
): Promise<AchievementType[]> => {
  return checkAchievementsS(userId);
};

