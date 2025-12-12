import { Router } from "express";
import verifier from "@/middlewares/verifier";
import {
  getPlatformAnalytics,
  getAdminDashboardStats,
  getAllUsers,
  getUserDetails,
  updateUser,
  deleteUser,
} from "@/controllers/admin/admin.controller";
import {
  seedSkillPathsController,
  seedChallengesController,
  seedAllController,
} from "@/controllers/admin/seed.controller";

const router = Router();

// All admin routes require authentication
router.use(verifier);

// Analytics
router.get("/analytics", getPlatformAnalytics);
router.get("/dashboard", getAdminDashboardStats);

// User management
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserDetails);
router.put("/users/:userId", updateUser);
router.delete("/users/:userId", deleteUser);

// Seed data (for development/testing)
router.post("/seed/skill-paths", seedSkillPathsController);
router.post("/seed/challenges", seedChallengesController);
router.post("/seed/all", seedAllController);

export default router;

