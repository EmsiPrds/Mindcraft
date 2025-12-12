export type SubmissionStatus = "pending" | "completed" | "reviewed";

export type SubmissionType = {
  _id: string;
  userId: string;
  challengeId: string | { _id: string; title: string };
  skillPathId: string | { _id: string; name: string };
  status: SubmissionStatus;
  submittedAt: string;
  completedAt?: string;
  reviewedAt?: string;
  title?: string;
  description?: string;
  files: string[];
  links?: string[];
  feedback?: string;
  rating?: number;
  xpEarned: number;
  coinsEarned: number;
  showInPortfolio: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
};

