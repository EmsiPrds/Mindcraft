export type AchievementType = {
  _id: string;
  name: string;
  description: string;
  icon: string;
  category: "milestone" | "streak" | "skill" | "community" | "special";
  requirement: {
    type: string;
    value: number;
    skillPathId?: string;
  };
  xpReward: number;
  coinReward: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

