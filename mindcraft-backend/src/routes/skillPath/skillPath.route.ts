import { Router } from "express";
import verifier from "@/middlewares/verifier";
import {
  getAllSkillPaths,
  getSkillPathById,
  getUserCurrentSkillPath,
  getAllUserSkillPathProgress,
  getUserSkillPathProgress,
  selectSkillPath,
  createSkillPath,
  updateSkillPath,
  deleteSkillPath,
} from "@/controllers/skillPath/skillPath.controller";

const router = Router();

// Public routes
router.get("/", getAllSkillPaths);
router.get("/:skillPathId", getSkillPathById);

// Protected routes (require authentication)
router.use(verifier);

// User skill path routes
router.get("/user/current", getUserCurrentSkillPath);
router.get("/user/progress", getAllUserSkillPathProgress);
router.get("/user/progress/:skillPathId", getUserSkillPathProgress);
router.post("/select", selectSkillPath);

// Admin routes (will add admin check later)
router.post("/", createSkillPath);
router.put("/:skillPathId", updateSkillPath);
router.delete("/:skillPathId", deleteSkillPath);

export default router;

