import Badge from "@/models/badge.model";
import { BadgeType } from "@/types/models/badge.type";
import { AppError } from "@/utils/error/appError";

/**
 * Create a new badge
 */
export const createBadgeS = async (
  badgeData: Omit<BadgeType, "_id" | "createdAt" | "updatedAt">
): Promise<BadgeType> => {
  const badge = await Badge.create(badgeData);
  return badge.toObject() as BadgeType;
};

/**
 * Get badge by ID
 */
export const getBadgeByIdS = async (
  badgeId: string
): Promise<BadgeType | null> => {
  const badge = await Badge.findById(badgeId).exec();
  if (!badge) return null;
  return badge.toObject() as BadgeType;
};

/**
 * Get all badges
 */
export const getAllBadgesS = async (filters?: {
  category?: string;
  rarity?: string;
  isActive?: boolean;
}): Promise<BadgeType[]> => {
  const query: any = {};
  
  if (filters?.category) query.category = filters.category;
  if (filters?.rarity) query.rarity = filters.rarity;
  if (filters?.isActive !== undefined) query.isActive = filters.isActive;

  const badges = await Badge.find(query).sort({ rarity: 1, name: 1 }).exec();
  return badges.map((b) => b.toObject() as BadgeType);
};

/**
 * Get user's badges
 */
export const getUserBadgesS = async (userId: string): Promise<BadgeType[]> => {
  const User = (await import("@/models/user.model")).default;
  const user = await User.findById(userId).populate("badges").exec();
  
  if (!user || !user.badges) return [];
  return (user.badges as any[]).map((b) => b.toObject() as BadgeType);
};

/**
 * Award badge to user
 */
export const awardBadgeToUserS = async (
  userId: string,
  badgeId: string
): Promise<{ awarded: boolean; badge?: BadgeType }> => {
  const User = (await import("@/models/user.model")).default;
  const user = await User.findById(userId).exec();
  
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Check if user already has this badge
  if (user.badges.includes(badgeId as any)) {
    return { awarded: false };
  }

  // Get badge details
  const badge = await getBadgeByIdS(badgeId);
  if (!badge) {
    throw new AppError("Badge not found", 404);
  }

  // Add badge to user
  user.badges.push(badgeId as any);
  
  // Add XP bonus if applicable
  if (badge.xpBonus > 0) {
    const { addXPToUserS } = await import("@/services/user/user.service");
    await addXPToUserS(user.accountId.toString(), badge.xpBonus);
  }

  await user.save();

  return { awarded: true, badge };
};

/**
 * Check and award streak badges
 */
export const checkStreakBadgesS = async (userId: string, streak: number): Promise<BadgeType[]> => {
  const badges = await Badge.find({
    category: "streak",
    isActive: true,
  }).exec();

  const awardedBadges: BadgeType[] = [];

  for (const badge of badges) {
    // Parse condition to extract streak requirement
    // Example: "Complete 7 days in a row" -> extract 7
    const condition = badge.condition || "";
    const streakMatch = condition.match(/(\d+)/);
    
    if (streakMatch) {
      const requiredStreak = parseInt(streakMatch[1]);
      if (streak >= requiredStreak) {
        const result = await awardBadgeToUserS(userId, badge._id.toString());
        if (result.awarded && result.badge) {
          awardedBadges.push(result.badge);
        }
      }
    }
  }

  return awardedBadges;
};

/**
 * Check and award challenge completion badges
 */
export const checkChallengeBadgesS = async (userId: string, completedCount: number): Promise<BadgeType[]> => {
  const badges = await Badge.find({
    category: "challenge",
    isActive: true,
  }).exec();

  const awardedBadges: BadgeType[] = [];

  for (const badge of badges) {
    const condition = badge.condition || "";
    const countMatch = condition.match(/(\d+)/);
    
    if (countMatch) {
      const requiredCount = parseInt(countMatch[1]);
      if (completedCount >= requiredCount) {
        const result = await awardBadgeToUserS(userId, badge._id.toString());
        if (result.awarded && result.badge) {
          awardedBadges.push(result.badge);
        }
      }
    }
  }

  return awardedBadges;
};

/**
 * Check and award skill path badges
 */
export const checkSkillPathBadgesS = async (
  userId: string,
  skillPathId: string,
  completedInPath: number
): Promise<BadgeType[]> => {
  const badges = await Badge.find({
    category: "skill",
    isActive: true,
  }).exec();

  const awardedBadges: BadgeType[] = [];

  for (const badge of badges) {
    const condition = badge.condition || "";
    // Check if badge is for this skill path
    if (condition.toLowerCase().includes(skillPathId.toLowerCase()) || 
        condition.toLowerCase().includes("complete")) {
      const countMatch = condition.match(/(\d+)/);
      if (countMatch) {
        const requiredCount = parseInt(countMatch[1]);
        if (completedInPath >= requiredCount) {
          const result = await awardBadgeToUserS(userId, badge._id.toString());
          if (result.awarded && result.badge) {
            awardedBadges.push(result.badge);
          }
        }
      }
    }
  }

  return awardedBadges;
};

