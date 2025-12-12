export type BadgeType = {
  _id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  category: "streak" | "challenge" | "skill" | "special" | "milestone";
  condition?: string;
  xpBonus?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

