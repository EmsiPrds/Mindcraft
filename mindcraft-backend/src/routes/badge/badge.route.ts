import { Router } from "express";
import verifier from "@/middlewares/verifier";
import {
  getAllBadges,
  getBadgeById,
  getUserBadges,
  createBadge,
} from "@/controllers/badge/badge.controller";

const router = Router();

// Public routes
router.get("/", getAllBadges);
router.get("/:badgeId", getBadgeById);

// Protected routes
router.use(verifier);

router.get("/user/my-badges", getUserBadges);

// Admin routes
router.post("/", createBadge);

export default router;

