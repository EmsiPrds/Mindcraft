import User from "@/models/user.model";
import Challenge from "@/models/challenge.model";
import Submission from "@/models/submission.model";
import { findOrCreateUserS } from "@/services/user/user.service";
import { getNextChallengeForUserS } from "./challenge.service";
import { AppError } from "@/utils/error/appError";

/**
 * Daily Challenge Assignment Service
 * Handles the logic for assigning daily challenges to users
 */

/**
 * Get or assign today's challenge for a user
 * This ensures users get a new challenge each day
 */
export const getOrAssignTodaysChallengeS = async (
  accountId: string
): Promise<{
  challenge: any;
  hasSubmitted: boolean;
  submissionId?: string;
  isNewChallenge: boolean;
} | null> => {
  const user = await findOrCreateUserS(accountId);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // If user has selected a skill path, get next challenge in that path
  if (user.selectedSkillPath) {
    // Count completed challenges in THIS skill path
    const completedInPath = await Submission.countDocuments({
      userId: user._id,
      skillPathId: user.selectedSkillPath,
      status: { $in: ["completed", "reviewed"] },
    }).exec();

    const nextChallenge = await getNextChallengeForUserS(
      user.selectedSkillPath as string,
      completedInPath
    );

    if (!nextChallenge) {
      // No more challenges in path
      return null;
    }

    // Check if user has already submitted this specific challenge today
    const existingSubmission = await Submission.findOne({
      userId: user._id,
      challengeId: nextChallenge._id,
      submittedAt: {
        $gte: today,
        $lt: tomorrow,
      },
    }).exec();

    // Check if user completed any challenge in this path today
    const todaysCompletion = await Submission.findOne({
      userId: user._id,
      skillPathId: user.selectedSkillPath,
      status: { $in: ["completed", "reviewed"] },
      completedAt: {
        $gte: today,
        $lt: tomorrow,
      },
    }).exec();

    return {
      challenge: nextChallenge,
      hasSubmitted: !!existingSubmission,
      submissionId: existingSubmission?._id.toString(),
      isNewChallenge: !todaysCompletion, // New if no challenge completed today
    };
  }

  // No skill path selected - get a random challenge
  // But try to avoid challenges user has done recently
  const recentChallenges = await Submission.find({
    userId: user._id,
    submittedAt: {
      $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
    },
  })
    .select("challengeId")
    .exec();

  const recentChallengeIds = recentChallenges.map((s) => s.challengeId.toString());

  // Get a challenge that user hasn't done recently
  let randomChallenge = await Challenge.findOne({
    isActive: true,
    _id: { $nin: recentChallengeIds },
  })
    .populate("skillPathId")
    .exec();

  // If all challenges were done recently, just get any active challenge
  if (!randomChallenge) {
    randomChallenge = await Challenge.findOne({ isActive: true })
      .populate("skillPathId")
      .exec();
  }

  if (!randomChallenge) return null;

  // Check if user submitted this challenge today
  const existingSubmission = await Submission.findOne({
    userId: user._id,
    challengeId: randomChallenge._id,
    submittedAt: {
      $gte: today,
      $lt: tomorrow,
    },
  }).exec();

  // Check if user completed any challenge today
  const todaysCompletion = await Submission.findOne({
    userId: user._id,
    status: { $in: ["completed", "reviewed"] },
    completedAt: {
      $gte: today,
      $lt: tomorrow,
    },
  }).exec();

  return {
    challenge: randomChallenge.toObject(),
    hasSubmitted: !!existingSubmission,
    submissionId: existingSubmission?._id.toString(),
    isNewChallenge: !todaysCompletion,
  };
};

/**
 * Check if user can get a new challenge today
 * Users can complete multiple challenges per day, but each challenge only once
 */
export const canGetNewChallengeTodayS = async (
  accountId: string,
  challengeId: string
): Promise<boolean> => {
  const user = await findOrCreateUserS(accountId);
  
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

  return !existingSubmission;
};

