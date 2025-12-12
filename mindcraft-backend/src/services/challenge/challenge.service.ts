import Challenge from "@/models/challenge.model";
import { ChallengeType } from "@/types/models/challenge.type";
import { AppError } from "@/utils/error/appError";

/**
 * Create a new challenge
 */
export const createChallengeS = async (
  challengeData: Omit<ChallengeType, "_id" | "createdAt" | "updatedAt">
): Promise<ChallengeType> => {
  // Check if challenge with same dayNumber and skillPathId already exists
  const existing = await Challenge.findOne({
    skillPathId: challengeData.skillPathId,
    dayNumber: challengeData.dayNumber,
    isActive: true,
  }).exec();

  if (existing) {
    throw new AppError(
      `Challenge for day ${challengeData.dayNumber} in this skill path already exists.`,
      409
    );
  }

  const challenge = await Challenge.create(challengeData);
  
  // Update skill path challenge count
  const { updateSkillPathChallengeCountS } = await import("@/services/skillPath/skillPath.service");
  await updateSkillPathChallengeCountS(challengeData.skillPathId);
  
  return challenge.toObject() as ChallengeType;
};

/**
 * Get challenge by ID
 */
export const getChallengeByIdS = async (
  challengeId: string
): Promise<ChallengeType | null> => {
  const challenge = await Challenge.findById(challengeId)
    .populate("skillPathId")
    .exec();
  
  if (!challenge) return null;
  return challenge.toObject() as ChallengeType;
};

/**
 * Get all challenges (with filters)
 */
export const getAllChallengesS = async (filters: {
  skillPathId?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  isActive?: boolean;
  limit?: number;
  skip?: number;
}): Promise<{ challenges: ChallengeType[]; total: number }> => {
  const query: any = {};
  
  if (filters.skillPathId) {
    query.skillPathId = filters.skillPathId;
  }
  if (filters.difficulty) {
    query.difficulty = filters.difficulty;
  }
  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive;
  }

  const total = await Challenge.countDocuments(query);
  const challenges = await Challenge.find(query)
    .populate("skillPathId")
    .sort({ dayNumber: 1 })
    .limit(filters.limit || 50)
    .skip(filters.skip || 0)
    .exec();

  return {
    challenges: challenges.map((c) => c.toObject() as ChallengeType),
    total,
  };
};

/**
 * Get challenge by skill path and day number
 */
export const getChallengeByDayS = async (
  skillPathId: string,
  dayNumber: number
): Promise<ChallengeType | null> => {
  const challenge = await Challenge.findOne({
    skillPathId,
    dayNumber,
    isActive: true,
  })
    .populate("skillPathId")
    .exec();

  if (!challenge) return null;
  return challenge.toObject() as ChallengeType;
};

/**
 * Update challenge
 */
export const updateChallengeS = async (
  challengeId: string,
  updates: Partial<ChallengeType>
): Promise<ChallengeType | null> => {
  const challenge = await Challenge.findById(challengeId).exec();
  if (!challenge) return null;

  const oldSkillPathId = challenge.skillPathId.toString();
  
  const updated = await Challenge.findByIdAndUpdate(
    challengeId,
    { $set: updates },
    { new: true }
  )
    .populate("skillPathId")
    .exec();

  if (!updated) return null;

  // Update skill path challenge counts if skill path or active status changed
  const { updateSkillPathChallengeCountS } = await import("@/services/skillPath/skillPath.service");
  
  if (updates.skillPathId && updates.skillPathId.toString() !== oldSkillPathId) {
    // Challenge moved to different skill path
    await updateSkillPathChallengeCountS(oldSkillPathId);
    await updateSkillPathChallengeCountS(updates.skillPathId.toString());
  } else if (updates.isActive !== undefined) {
    // Active status changed
    await updateSkillPathChallengeCountS(oldSkillPathId);
  }
  
  return updated.toObject() as ChallengeType;
};

/**
 * Delete challenge (soft delete by setting isActive to false)
 */
export const deleteChallengeS = async (
  challengeId: string
): Promise<boolean> => {
  const challenge = await Challenge.findById(challengeId).exec();
  if (!challenge) return false;

  const skillPathId = challenge.skillPathId.toString();
  
  const result = await Challenge.findByIdAndUpdate(
    challengeId,
    { $set: { isActive: false } },
    { new: true }
  ).exec();

  if (result) {
    // Update skill path challenge count
    const { updateSkillPathChallengeCountS } = await import("@/services/skillPath/skillPath.service");
    await updateSkillPathChallengeCountS(skillPathId);
  }

  return !!result;
};

/**
 * Get next challenge for a user based on their progress
 */
export const getNextChallengeForUserS = async (
  skillPathId: string,
  completedChallenges: number
): Promise<ChallengeType | null> => {
  const nextDayNumber = completedChallenges + 1;
  
  const challenge = await Challenge.findOne({
    skillPathId,
    dayNumber: nextDayNumber,
    isActive: true,
  })
    .populate("skillPathId")
    .exec();

  return challenge ? (challenge.toObject() as ChallengeType) : null;
};

/**
 * Get random challenge (for daily challenge if user hasn't selected a path)
 */
export const getRandomChallengeS = async (): Promise<ChallengeType | null> => {
  const count = await Challenge.countDocuments({ isActive: true });
  if (count === 0) return null;

  const random = Math.floor(Math.random() * count);
  const challenge = await Challenge.findOne({ isActive: true })
    .populate("skillPathId")
    .skip(random)
    .exec();

  return challenge ? (challenge.toObject() as ChallengeType) : null;
};

