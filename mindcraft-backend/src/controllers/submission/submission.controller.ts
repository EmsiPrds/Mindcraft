import type { CustomRequest, Response } from "@/types/express/express.type";
import {
  createSubmissionS,
  getSubmissionByIdS,
  getAllSubmissionsS,
  getUserSubmissionsS,
  getUserPortfolioS,
  getPublicPortfolioS,
  updateSubmissionS,
  deleteSubmissionS,
  reviewSubmissionS,
  togglePortfolioVisibilityS,
  togglePublicVisibilityS,
  getUserSubmissionStatsS,
} from "@/services/submission/submission.service";
import { findOrCreateUserS } from "@/services/user/user.service";
import { AppError } from "@/utils/error/appError";

/**
 * Get user's submissions
 */
export const getUserSubmissions = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (!req.account) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await findOrCreateUserS(req.account._id.toString());
  const { skillPathId, status, showInPortfolio, limit, skip } = req.query;

  const result = await getUserSubmissionsS(user._id, {
    skillPathId: skillPathId as string,
    status: status as any,
    showInPortfolio: showInPortfolio === "true" ? true : showInPortfolio === "false" ? false : undefined,
    limit: limit ? parseInt(limit as string) : undefined,
    skip: skip ? parseInt(skip as string) : undefined,
  });

  res.status(200).json({
    message: "Submissions retrieved successfully",
    data: result,
  });
};

/**
 * Get user's portfolio
 */
export const getUserPortfolio = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (!req.account) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await findOrCreateUserS(req.account._id.toString());
  const { skillPathId, limit, skip } = req.query;

  const result = await getUserPortfolioS(user._id, {
    skillPathId: skillPathId as string,
    limit: limit ? parseInt(limit as string) : undefined,
    skip: skip ? parseInt(skip as string) : undefined,
  });

  res.status(200).json({
    message: "Portfolio retrieved successfully",
    data: result,
  });
};

/**
 * Get public portfolio (for browsing)
 */
export const getPublicPortfolio = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { skillPathId, userId, limit, skip } = req.query;

  const result = await getPublicPortfolioS({
    skillPathId: skillPathId as string,
    userId: userId as string,
    limit: limit ? parseInt(limit as string) : undefined,
    skip: skip ? parseInt(skip as string) : undefined,
  });

  res.status(200).json({
    message: "Public portfolio retrieved successfully",
    data: result,
  });
};

/**
 * Get submission by ID
 */
export const getSubmissionById = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { submissionId } = req.params;

  if (!submissionId) {
    throw new AppError("Submission ID is required", 400);
  }

  const submission = await getSubmissionByIdS(submissionId);

  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  // Check if user has access (owner or public)
  if (!req.account) {
    // Public access check
    if (!submission.isPublic) {
      throw new AppError("Submission is not public", 403);
    }
  } else {
    const user = await findOrCreateUserS(req.account._id.toString());
    // Check if user is owner or submission is public
    if (submission.userId.toString() !== user._id && !submission.isPublic) {
      throw new AppError("Unauthorized access", 403);
    }
  }

  res.status(200).json({
    message: "Submission retrieved successfully",
    data: submission,
  });
};

/**
 * Update submission (user can update their own)
 */
export const updateSubmission = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (!req.account) {
    throw new AppError("Unauthorized", 401);
  }

  const { submissionId } = req.params;
  const updates = req.body;

  if (!submissionId) {
    throw new AppError("Submission ID is required", 400);
  }

  // Verify ownership
  const submission = await getSubmissionByIdS(submissionId);
  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  const user = await findOrCreateUserS(req.account._id.toString());
  if (submission.userId.toString() !== user._id) {
    throw new AppError("Unauthorized - You can only update your own submissions", 403);
  }

  const updated = await updateSubmissionS(submissionId, updates);

  if (!updated) {
    throw new AppError("Failed to update submission", 500);
  }

  res.status(200).json({
    message: "Submission updated successfully",
    data: updated,
  });
};

/**
 * Delete submission
 */
export const deleteSubmission = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (!req.account) {
    throw new AppError("Unauthorized", 401);
  }

  const { submissionId } = req.params;

  if (!submissionId) {
    throw new AppError("Submission ID is required", 400);
  }

  // Verify ownership
  const submission = await getSubmissionByIdS(submissionId);
  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  const user = await findOrCreateUserS(req.account._id.toString());
  if (submission.userId.toString() !== user._id) {
    throw new AppError("Unauthorized - You can only delete your own submissions", 403);
  }

  const deleted = await deleteSubmissionS(submissionId);

  if (!deleted) {
    throw new AppError("Failed to delete submission", 500);
  }

  res.status(200).json({
    message: "Submission deleted successfully",
  });
};

/**
 * Review submission (admin action)
 */
export const reviewSubmission = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (!req.account) {
    throw new AppError("Unauthorized", 401);
  }

  // TODO: Add admin check here
  // if (!req.account.isAdmin) {
  //   throw new AppError("Admin access required", 403);
  // }

  const { submissionId } = req.params;
  const { feedback, rating, status } = req.body;

  if (!submissionId) {
    throw new AppError("Submission ID is required", 400);
  }

  const reviewed = await reviewSubmissionS(submissionId, {
    feedback,
    rating,
    status,
  });

  if (!reviewed) {
    throw new AppError("Submission not found", 404);
  }

  res.status(200).json({
    message: "Submission reviewed successfully",
    data: reviewed,
  });
};

/**
 * Toggle portfolio visibility
 */
export const togglePortfolioVisibility = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (!req.account) {
    throw new AppError("Unauthorized", 401);
  }

  const { submissionId } = req.params;
  const { showInPortfolio } = req.body;

  if (!submissionId) {
    throw new AppError("Submission ID is required", 400);
  }

  if (typeof showInPortfolio !== "boolean") {
    throw new AppError("showInPortfolio must be a boolean", 400);
  }

  // Verify ownership
  const submission = await getSubmissionByIdS(submissionId);
  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  const user = await findOrCreateUserS(req.account._id.toString());
  if (submission.userId.toString() !== user._id) {
    throw new AppError("Unauthorized - You can only update your own submissions", 403);
  }

  const updated = await togglePortfolioVisibilityS(submissionId, showInPortfolio);

  if (!updated) {
    throw new AppError("Failed to update submission", 500);
  }

  res.status(200).json({
    message: "Portfolio visibility updated successfully",
    data: updated,
  });
};

/**
 * Toggle public visibility
 */
export const togglePublicVisibility = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (!req.account) {
    throw new AppError("Unauthorized", 401);
  }

  const { submissionId } = req.params;
  const { isPublic } = req.body;

  if (!submissionId) {
    throw new AppError("Submission ID is required", 400);
  }

  if (typeof isPublic !== "boolean") {
    throw new AppError("isPublic must be a boolean", 400);
  }

  // Verify ownership
  const submission = await getSubmissionByIdS(submissionId);
  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  const user = await findOrCreateUserS(req.account._id.toString());
  if (submission.userId.toString() !== user._id) {
    throw new AppError("Unauthorized - You can only update your own submissions", 403);
  }

  const updated = await togglePublicVisibilityS(submissionId, isPublic);

  if (!updated) {
    throw new AppError("Failed to update submission", 500);
  }

  res.status(200).json({
    message: "Public visibility updated successfully",
    data: updated,
  });
};

/**
 * Get user's submission statistics
 */
export const getUserSubmissionStats = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (!req.account) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await findOrCreateUserS(req.account._id.toString());
  const stats = await getUserSubmissionStatsS(user._id);

  res.status(200).json({
    message: "Statistics retrieved successfully",
    data: stats,
  });
};

/**
 * Get all submissions (admin - with filters)
 */
export const getAllSubmissions = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (!req.account) {
    throw new AppError("Unauthorized", 401);
  }

  // TODO: Add admin check
  // if (!req.account.isAdmin) {
  //   throw new AppError("Admin access required", 403);
  // }

  const {
    userId,
    challengeId,
    skillPathId,
    status,
    showInPortfolio,
    isPublic,
    limit,
    skip,
    sortBy,
  } = req.query;

  const result = await getAllSubmissionsS({
    userId: userId as string,
    challengeId: challengeId as string,
    skillPathId: skillPathId as string,
    status: status as any,
    showInPortfolio: showInPortfolio === "true" ? true : showInPortfolio === "false" ? false : undefined,
    isPublic: isPublic === "true" ? true : isPublic === "false" ? false : undefined,
    limit: limit ? parseInt(limit as string) : undefined,
    skip: skip ? parseInt(skip as string) : undefined,
    sortBy: sortBy as any,
  });

  res.status(200).json({
    message: "Submissions retrieved successfully",
    data: result,
  });
};

