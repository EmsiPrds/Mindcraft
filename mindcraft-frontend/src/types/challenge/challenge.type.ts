export type ChallengeType = {
  _id: string;
  title: string;
  description: string;
  instructions: string;
  skillPathId: string | { _id: string; name: string };
  difficulty: "beginner" | "intermediate" | "advanced";
  dayNumber: number;
  xpReward: number;
  coinReward: number;
  estimatedTime?: number;
  tags: string[];
  exampleImages?: string[];
  aiGenerated: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TodaysChallengeType = {
  challenge: ChallengeType;
  hasSubmitted: boolean;
  submissionId?: string;
};

