import { Document } from "mongoose";

export type AchievementType = {
  _id: string;
  name: string;
  description: string;
  icon: string; // Icon identifier or URL
  category: "milestone" | "streak" | "skill" | "community" | "special";
  requirement: {
    type: string; // e.g., "complete_challenges", "reach_level", "maintain_streak"
    value: number; // Target value
    skillPathId?: string; // Optional: specific to a skill path
  };
  xpReward: number; // XP awarded when achievement is unlocked
  coinReward: number; // Coins awarded
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AchievementDocumentType = AchievementType & Document;

