import { Router } from "express";
import verifier from "@/middlewares/verifier";
import {
  getGlobalLeaderboardXP,
  getGlobalLeaderboardStreak,
  getGlobalLeaderboardLevel,
  getSkillPathLeaderboard,
  getUserGlobalRank,
  getUserSkillPathRank,
} from "@/controllers/leaderboard/leaderboard.controller";

const router = Router();

// Public routes
router.get("/global/xp", getGlobalLeaderboardXP);
router.get("/global/streak", getGlobalLeaderboardStreak);
router.get("/global/level", getGlobalLeaderboardLevel);
router.get("/skill-path/:skillPathId", getSkillPathLeaderboard);

// Protected routes (require authentication)
router.use(verifier);

router.get("/user/rank", getUserGlobalRank);
router.get("/user/rank/skill-path/:skillPathId", getUserSkillPathRank);

export default router;

