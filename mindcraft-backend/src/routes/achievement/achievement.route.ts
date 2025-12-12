import { Router } from "express";
import verifier from "@/middlewares/verifier";
import {
  getAllAchievements,
  getAchievementById,
  getUserAchievements,
  createAchievement,
} from "@/controllers/achievement/achievement.controller";

const router = Router();

// Public routes
router.get("/", getAllAchievements);
router.get("/:achievementId", getAchievementById);

// Protected routes
router.use(verifier);

router.get("/user/my-achievements", getUserAchievements);

// Admin routes
router.post("/", createAchievement);

export default router;

