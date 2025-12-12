export type SkillPathType = {
  _id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedDuration?: number;
  totalChallenges: number;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type SkillPathProgressType = {
  skillPath: SkillPathType;
  progress: {
    completed: number;
    total: number;
    percentage: number;
    currentDay: number;
    nextChallenge?: ChallengeType;
  };
  stats: {
    totalXP: number;
    totalCoins: number;
    averageRating?: number;
  };
};

