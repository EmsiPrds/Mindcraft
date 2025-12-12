import { Document } from "mongoose";

export type SkillPathType = {
  _id: string;
  name: string; // e.g., "Graphic Design", "Web Development"
  description: string;
  icon?: string; // Icon identifier or URL
  color?: string; // Theme color for the path
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedDuration?: number; // Days to complete
  totalChallenges: number; // Total challenges in this path
  isActive: boolean; // Whether path is available
  order: number; // Display order
  createdAt: Date;
  updatedAt: Date;
};

export type SkillPathDocumentType = SkillPathType & Document;

