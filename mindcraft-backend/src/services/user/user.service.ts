import User from "@/models/user.model";
import { UserType } from "@/types/models/user.type";
import { getLevelFromXP } from "@/utils/gamification/xpCalculator";

/**
 * Find or create user profile for an account
 */
export const findOrCreateUserS = async (
  accountId: string
): Promise<UserType> => {
  let user = await User.findOne({ accountId }).populate("selectedSkillPath").exec();
  
  if (!user) {
    // Create new user profile
    user = await User.create({
      accountId,
      xp: 0,
      level: 1,
      coins: 0,
      currentStreak: 0,
      longestStreak: 0,
      completedChallenges: 0,
      badges: [],
      achievements: [],
    });
  }
  
  // Ensure level is synced with XP
  const calculatedLevel = getLevelFromXP(user.xp);
  if (user.level !== calculatedLevel) {
    user.level = calculatedLevel;
    await user.save();
  }
  
  return user.toObject() as UserType;
};

/**
 * Find user by account ID
 */
export const findUserByAccountIdS = async (
  accountId: string
): Promise<UserType | null> => {
  const user = await User.findOne({ accountId })
    .populate("selectedSkillPath")
    .populate("badges")
    .populate("achievements")
    .exec();
  
  if (!user) return null;
  return user.toObject() as UserType;
};

/**
 * Update user profile
 */
export const updateUserS = async (
  accountId: string,
  updates: Partial<UserType>
): Promise<UserType | null> => {
  const user = await User.findOneAndUpdate(
    { accountId },
    { $set: updates },
    { new: true }
  ).exec();
  
  if (!user) return null;
  
  // Recalculate level if XP changed
  if (updates.xp !== undefined) {
    user.level = getLevelFromXP(user.xp);
    await user.save();
  }
  
  return user.toObject() as UserType;
};

/**
 * Add XP to user
 */
export const addXPToUserS = async (
  accountId: string,
  xpAmount: number
): Promise<UserType | null> => {
  const user = await User.findOne({ accountId }).exec();
  if (!user) return null;
  
  user.xp += xpAmount;
  user.level = getLevelFromXP(user.xp);
  await user.save();
  
  return user.toObject() as UserType;
};

/**
 * Add coins to user
 */
export const addCoinsToUserS = async (
  accountId: string,
  coinAmount: number
): Promise<UserType | null> => {
  const user = await User.findOneAndUpdate(
    { accountId },
    { $inc: { coins: coinAmount } },
    { new: true }
  ).exec();
  
  if (!user) return null;
  return user.toObject() as UserType;
};

