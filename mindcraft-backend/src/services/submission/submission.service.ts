import Submission from "@/models/submission.model";
import { SubmissionType, SubmissionStatus } from "@/types/models/submission.type";
import { AppError } from "@/utils/error/appError";

/**
 * Create a new submission
 */
export const createSubmissionS = async (
  submissionData: Omit<SubmissionType, "_id" | "createdAt" | "updatedAt">
): Promise<SubmissionType> => {
  const submission = await Submission.create(submissionData);
  return submission.toObject() as SubmissionType;
};

/**
 * Get submission by ID
 */
export const getSubmissionByIdS = async (
  submissionId: string
): Promise<SubmissionType | null> => {
  const submission = await Submission.findById(submissionId)
    .populate("userId", "accountId")
    .populate("challengeId")
    .populate("skillPathId")
    .exec();

  if (!submission) return null;
  return submission.toObject() as SubmissionType;
};

/**
 * Get all submissions with filters
 */
export const getAllSubmissionsS = async (filters: {
  userId?: string;
  challengeId?: string;
  skillPathId?: string;
  status?: SubmissionStatus;
  showInPortfolio?: boolean;
  isPublic?: boolean;
  limit?: number;
  skip?: number;
  sortBy?: "newest" | "oldest" | "xp";
}): Promise<{ submissions: SubmissionType[]; total: number }> => {
  const query: any = {};

  if (filters.userId) query.userId = filters.userId;
  if (filters.challengeId) query.challengeId = filters.challengeId;
  if (filters.skillPathId) query.skillPathId = filters.skillPathId;
  if (filters.status) query.status = filters.status;
  if (filters.showInPortfolio !== undefined) query.showInPortfolio = filters.showInPortfolio;
  if (filters.isPublic !== undefined) query.isPublic = filters.isPublic;

  const total = await Submission.countDocuments(query);

  // Determine sort order
  let sort: any = { createdAt: -1 }; // Default: newest first
  if (filters.sortBy === "oldest") {
    sort = { createdAt: 1 };
  } else if (filters.sortBy === "xp") {
    sort = { xpEarned: -1 };
  }

  const submissions = await Submission.find(query)
    .populate("userId", "accountId")
    .populate("challengeId")
    .populate("skillPathId")
    .sort(sort)
    .limit(filters.limit || 50)
    .skip(filters.skip || 0)
    .exec();

  return {
    submissions: submissions.map((s) => s.toObject() as SubmissionType),
    total,
  };
};

/**
 * Get user's submissions
 */
export const getUserSubmissionsS = async (
  userId: string,
  filters?: {
    skillPathId?: string;
    status?: SubmissionStatus;
    showInPortfolio?: boolean;
    limit?: number;
    skip?: number;
  }
): Promise<{ submissions: SubmissionType[]; total: number }> => {
  return getAllSubmissionsS({
    userId,
    ...filters,
  });
};

/**
 * Get user's portfolio (public submissions)
 */
export const getUserPortfolioS = async (
  userId: string,
  filters?: {
    skillPathId?: string;
    limit?: number;
    skip?: number;
  }
): Promise<{ submissions: SubmissionType[]; total: number }> => {
  return getAllSubmissionsS({
    userId,
    showInPortfolio: true,
    ...filters,
  });
};

/**
 * Get public portfolio submissions (for browsing)
 */
export const getPublicPortfolioS = async (filters?: {
  skillPathId?: string;
  userId?: string;
  limit?: number;
  skip?: number;
}): Promise<{ submissions: SubmissionType[]; total: number }> => {
  return getAllSubmissionsS({
    isPublic: true,
    showInPortfolio: true,
    ...filters,
  });
};

/**
 * Update submission
 */
export const updateSubmissionS = async (
  submissionId: string,
  updates: Partial<SubmissionType>
): Promise<SubmissionType | null> => {
  const submission = await Submission.findByIdAndUpdate(
    submissionId,
    { $set: updates },
    { new: true }
  )
    .populate("userId", "accountId")
    .populate("challengeId")
    .populate("skillPathId")
    .exec();

  if (!submission) return null;
  return submission.toObject() as SubmissionType;
};

/**
 * Delete submission
 */
export const deleteSubmissionS = async (
  submissionId: string
): Promise<boolean> => {
  const result = await Submission.findByIdAndDelete(submissionId).exec();
  return !!result;
};

/**
 * Review submission (admin action)
 */
export const reviewSubmissionS = async (
  submissionId: string,
  reviewData: {
    feedback?: string;
    rating?: number;
    status?: SubmissionStatus;
  }
): Promise<SubmissionType | null> => {
  const updates: any = {
    reviewedAt: new Date(),
    ...reviewData,
  };

  // If status is provided, update it
  if (reviewData.status) {
    updates.status = reviewData.status;
  } else {
    // Default to reviewed if not specified
    updates.status = "reviewed";
  }

  const submission = await Submission.findByIdAndUpdate(
    submissionId,
    { $set: updates },
    { new: true }
  )
    .populate("userId", "accountId")
    .populate("challengeId")
    .populate("skillPathId")
    .exec();

  if (!submission) return null;
  return submission.toObject() as SubmissionType;
};

/**
 * Toggle portfolio visibility
 */
export const togglePortfolioVisibilityS = async (
  submissionId: string,
  showInPortfolio: boolean
): Promise<SubmissionType | null> => {
  const submission = await Submission.findByIdAndUpdate(
    submissionId,
    { $set: { showInPortfolio } },
    { new: true }
  )
    .populate("userId", "accountId")
    .populate("challengeId")
    .populate("skillPathId")
    .exec();

  if (!submission) return null;
  return submission.toObject() as SubmissionType;
};

/**
 * Toggle public visibility
 */
export const togglePublicVisibilityS = async (
  submissionId: string,
  isPublic: boolean
): Promise<SubmissionType | null> => {
  const submission = await Submission.findByIdAndUpdate(
    submissionId,
    { $set: { isPublic } },
    { new: true }
  )
    .populate("userId", "accountId")
    .populate("challengeId")
    .populate("skillPathId")
    .exec();

  if (!submission) return null;
  return submission.toObject() as SubmissionType;
};

/**
 * Get submission statistics for a user
 */
export const getUserSubmissionStatsS = async (
  userId: string
): Promise<{
  totalSubmissions: number;
  completedSubmissions: number;
  reviewedSubmissions: number;
  totalXPEarned: number;
  totalCoinsEarned: number;
  portfolioCount: number;
  bySkillPath: Array<{
    skillPathId: string;
    count: number;
  }>;
}> => {
  const submissions = await Submission.find({ userId }).exec();

  const stats = {
    totalSubmissions: submissions.length,
    completedSubmissions: submissions.filter((s) => s.status === "completed" || s.status === "reviewed").length,
    reviewedSubmissions: submissions.filter((s) => s.status === "reviewed").length,
    totalXPEarned: submissions.reduce((sum, s) => sum + s.xpEarned, 0),
    totalCoinsEarned: submissions.reduce((sum, s) => sum + s.coinsEarned, 0),
    portfolioCount: submissions.filter((s) => s.showInPortfolio).length,
    bySkillPath: [] as Array<{ skillPathId: string; count: number }>,
  };

  // Group by skill path
  const skillPathMap = new Map<string, number>();
  submissions.forEach((s) => {
    const pathId = s.skillPathId.toString();
    skillPathMap.set(pathId, (skillPathMap.get(pathId) || 0) + 1);
  });

  stats.bySkillPath = Array.from(skillPathMap.entries()).map(([skillPathId, count]) => ({
    skillPathId,
    count,
  }));

  return stats;
};

