import { Router } from "express";
import verifier from "@/middlewares/verifier";
import {
  getUserSubmissions,
  getUserPortfolio,
  getPublicPortfolio,
  getSubmissionById,
  updateSubmission,
  deleteSubmission,
  reviewSubmission,
  togglePortfolioVisibility,
  togglePublicVisibility,
  getUserSubmissionStats,
  getAllSubmissions,
} from "@/controllers/submission/submission.controller";

const router = Router();

// Public routes
router.get("/public", getPublicPortfolio);
router.get("/public/:submissionId", getSubmissionById);

// Protected routes (require authentication)
router.use(verifier);

// User submission routes
router.get("/my-submissions", getUserSubmissions);
router.get("/my-portfolio", getUserPortfolio);
router.get("/stats", getUserSubmissionStats);
router.get("/:submissionId", getSubmissionById);
router.put("/:submissionId", updateSubmission);
router.delete("/:submissionId", deleteSubmission);
router.put("/:submissionId/portfolio-visibility", togglePortfolioVisibility);
router.put("/:submissionId/public-visibility", togglePublicVisibility);

// Admin routes (will add admin check later)
router.get("/admin/all", getAllSubmissions);
router.post("/:submissionId/review", reviewSubmission);

export default router;

