import Submission from "@/models/submission.model";
import User from "@/models/user.model";
import Challenge from "@/models/challenge.model";
import { findOrCreateUserS } from "@/services/user/user.service";
import { getNextChallengeForUserS } from "./challenge.service";
import { calculateStreak, getStreakBonus } from "@/utils/gamification/streakManager";
import { getLevelFromXP } from "@/utils/gamification/xpCalculator";
import { AppError } from "@/utils/error/appError";
import { getOrAssignTodaysChallengeS } from "./dailyChallenge.service";

/**
 * Get today's challenge for a user
 * Returns the challenge they should work on today
 * Uses the daily challenge service for better logic
 */
export const getTodaysChallengeS = async (
  accountId: string
): Promise<{
  challenge: any;
  hasSubmitted: boolean;
  submissionId?: string;
} | null> => {
  const result = await getOrAssignTodaysChallengeS(accountId);
  
  if (!result) return null;

  return {
    challenge: result.challenge,
    hasSubmitted: result.hasSubmitted,
    submissionId: result.submissionId,
  };
};

/**
 * Get user's challenge progress for a skill path
 */
export const getUserChallengeProgressS = async (
  accountId: string,
  skillPathId: string
): Promise<{
  completed: number;
  total: number;
  currentDay: number;
  nextChallenge?: any;
}> => {
  const user = await findOrCreateUserS(accountId);

  // Count completed challenges in this skill path
  const completedSubmissions = await Submission.countDocuments({
    userId: user._id,
    skillPathId,
    status: { $in: ["completed", "reviewed"] },
  }).exec();

  // Get total challenges in path
  const totalChallenges = await Challenge.countDocuments({
    skillPathId,
    isActive: true,
  }).exec();

  // Get next challenge
  const nextChallenge = await getNextChallengeForUserS(
    skillPathId,
    completedSubmissions
  );

  return {
    completed: completedSubmissions,
    total: totalChallenges,
    currentDay: completedSubmissions + 1,
    nextChallenge: nextChallenge || undefined,
  };
};

/**
 * Mark challenge as completed and update user stats
 */
export const completeChallengeS = async (
  accountId: string,
  challengeId: string,
  submissionData: {
    title?: string;
    description?: string;
    files: string[];
    links?: string[];
  }
): Promise<{
  submission: any;
  user: any;
  levelUp: boolean;
  newBadges: any[];
  newAchievements: any[];
}> => {
  const user = await User.findOne({ accountId }).exec();
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const challenge = await Challenge.findById(challengeId).exec();
  if (!challenge) {
    throw new AppError("Challenge not found", 404);
  }

  // Check if already submitted today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const existingSubmission = await Submission.findOne({
    userId: user._id,
    challengeId,
    submittedAt: {
      $gte: today,
      $lt: tomorrow,
    },
  }).exec();

  if (existingSubmission) {
    throw new AppError("Challenge already submitted today", 400);
  }

  // Calculate streak
  const newStreak = calculateStreak(user.lastChallengeDate, user.currentStreak);
  const streakBonus = getStreakBonus(newStreak);

  // Calculate rewards
  const xpEarned = challenge.xpReward + streakBonus.xpBonus;
  const coinsEarned = challenge.coinReward + streakBonus.coinBonus;

  // Check for level up
  const oldLevel = user.level;
  user.xp += xpEarned;
  user.coins += coinsEarned;
  user.currentStreak = newStreak;
  if (newStreak > user.longestStreak) {
    user.longestStreak = newStreak;
  }
  user.lastChallengeDate = new Date();
  user.completedChallenges += 1;

  // Recalculate level
  user.level = getLevelFromXP(user.xp);
  const levelUp = user.level > oldLevel;

  await user.save();

  // Create submission
  const submission = await Submission.create({
    userId: user._id,
    challengeId: challenge._id,
    skillPathId: challenge.skillPathId,
    status: "completed",
    submittedAt: new Date(),
    completedAt: new Date(),
    title: submissionData.title,
    description: submissionData.description,
    files: submissionData.files,
    links: submissionData.links || [],
    xpEarned,
    coinsEarned,
    showInPortfolio: true,
    isPublic: false,
  });

  // Check for badge unlocks
  const {
    checkStreakBadgesS,
    checkChallengeBadgesS,
    checkSkillPathBadgesS,
  } = await import("@/services/badge/badge.service");
  
  const streakBadges = await checkStreakBadgesS(user._id.toString(), newStreak);
  const challengeBadges = await checkChallengeBadgesS(user._id.toString(), user.completedChallenges);
  
  // Get completed challenges in this skill path
  const completedInPath = await Submission.countDocuments({
    userId: user._id,
    skillPathId: challenge.skillPathId,
    status: { $in: ["completed", "reviewed"] },
  }).exec();
  
  const skillPathBadges = await checkSkillPathBadgesS(
    user._id.toString(),
    challenge.skillPathId.toString(),
    completedInPath
  );

  const allNewBadges = [...streakBadges, ...challengeBadges, ...skillPathBadges];

  // Check for achievement unlocks
  const { checkAchievementsAfterCompletionS } = await import("@/services/achievement/achievement.service");
  const newAchievements = await checkAchievementsAfterCompletionS(
    user._id.toString(),
    challenge.skillPathId.toString()
  );

  // Refresh user data to get updated stats
  await user.populate("badges achievements");
  const updatedUser = await User.findById(user._id).exec();

  return {
    submission: submission.toObject(),
    user: updatedUser?.toObject() || user.toObject(),
    levelUp,
    newBadges: allNewBadges,
    newAchievements,
  };
};

