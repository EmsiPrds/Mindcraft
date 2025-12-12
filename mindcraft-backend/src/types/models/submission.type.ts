import { Document } from "mongoose";

export type SubmissionStatus = "pending" | "completed" | "reviewed";

export type SubmissionType = {
  _id: string;
  userId: string; // Reference to User
  challengeId: string; // Reference to Challenge
  skillPathId: string; // Reference to SkillPath (for quick filtering)
  status: SubmissionStatus;
  submittedAt: Date;
  completedAt?: Date; // When user marked as complete
  reviewedAt?: Date; // When admin reviewed (if applicable)
  
  // Submission content
  title?: string; // User's title for their work
  description?: string; // User's description
  files: string[]; // URLs to uploaded files (images, documents, etc.)
  links?: string[]; // External links (e.g., Figma, CodePen, GitHub)
  
  // Feedback (optional, can be AI or admin)
  feedback?: string;
  rating?: number; // 1-5 stars (optional)
  
  // Rewards (stored for history)
  xpEarned: number;
  coinsEarned: number;
  
  // Portfolio settings
  showInPortfolio: boolean; // Whether to display in public portfolio
  isPublic: boolean; // Public visibility
  
  createdAt: Date;
  updatedAt: Date;
};

export type SubmissionDocumentType = SubmissionType & Document;

