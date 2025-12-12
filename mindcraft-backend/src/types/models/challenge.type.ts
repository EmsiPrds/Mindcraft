import { Document } from "mongoose";

export type ChallengeType = {
  _id: string;
  title: string;
  description: string;
  instructions: string; // Detailed instructions for the challenge
  skillPathId: string; // Reference to SkillPath
  difficulty: "beginner" | "intermediate" | "advanced";
  dayNumber: number; // Day number in the skill path (1, 2, 3...)
  xpReward: number; // XP awarded on completion
  coinReward: number; // Coins awarded on completion
  estimatedTime?: number; // Minutes to complete
  tags: string[]; // e.g., ["design", "color", "typography"]
  exampleImages?: string[]; // URLs to example images
  aiGenerated: boolean; // Whether challenge was AI-generated
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ChallengeDocumentType = ChallengeType & Document;

