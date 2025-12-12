import { Document } from "mongoose";

export type BadgeType = {
  _id: string;
  name: string;
  description: string;
  icon: string; // Icon identifier or URL
  rarity: "common" | "rare" | "epic" | "legendary";
  category: "streak" | "challenge" | "skill" | "special" | "milestone";
  condition?: string; // Description of how to earn (e.g., "Complete 10 challenges")
  xpBonus?: number; // Bonus XP when badge is earned
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type BadgeDocumentType = BadgeType & Document;

