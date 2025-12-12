import { Router } from "express";
import verifier from "@/middlewares/verifier";
import {
  getTodaysChallenge,
  getChallengeProgress,
  completeChallenge,
  createChallenge,
  getAllChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge,
  generateAIChallenge,
  triggerAIChallengeGeneration,
} from "@/controllers/challenge/challenge.controller";

const router = Router();

// Public routes (no auth required for now, but can add later)
// router.get("/", getAllChallenges);
// router.get("/:challengeId", getChallengeById);

// AI Agent endpoint (no auth required - for n9n workflows and AI services)
// This endpoint is designed to accept AI-generated challenge data
router.post("/ai/generate", generateAIChallenge);

// Protected routes (require authentication)
router.use(verifier);

// User challenge routes
router.get("/today", getTodaysChallenge);
router.get("/progress/:skillPathId", getChallengeProgress);
router.post("/:challengeId/complete", completeChallenge);
router.post("/ai/trigger", triggerAIChallengeGeneration);

// Challenge CRUD routes (Admin routes - will add admin check later)
router.post("/", createChallenge);
router.get("/", getAllChallenges);
router.get("/:challengeId", getChallengeById);
router.put("/:challengeId", updateChallenge);
router.delete("/:challengeId", deleteChallenge);

export default router;

