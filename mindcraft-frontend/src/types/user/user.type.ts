export type UserType = {
  _id: string;
  accountId: string;
  xp: number;
  level: number;
  coins: number;
  currentStreak: number;
  longestStreak: number;
  lastChallengeDate?: string;
  selectedSkillPath?: string;
  completedChallenges: number;
  badges: string[];
  achievements: string[];
  createdAt: string;
  updatedAt: string;
};

