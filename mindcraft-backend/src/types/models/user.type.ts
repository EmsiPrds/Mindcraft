import { Document } from "mongoose";

export type UserType = {
  _id: string;
  accountId: string; // Reference to Account
  xp: number; // Total experience points
  level: number; // Current level
  coins: number; // Virtual currency
  currentStreak: number; // Current daily streak
  longestStreak: number; // Longest streak achieved
  lastChallengeDate?: Date; // Last challenge completion date
  selectedSkillPath?: string; // Currently selected skill path ID
  completedChallenges: number; // Total challenges completed
  badges: string[]; // Array of badge IDs
  achievements: string[]; // Array of achievement IDs
  createdAt: Date;
  updatedAt: Date;
};

export type UserDocumentType = UserType & Document;

