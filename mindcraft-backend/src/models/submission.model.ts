import { SubmissionDocumentType } from "@/types/models/submission.type";
import { model, Model, Schema } from "mongoose";

const submissionSchema = new Schema<SubmissionDocumentType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    challengeId: {
      type: Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
    skillPathId: {
      type: Schema.Types.ObjectId,
      ref: "SkillPath",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "reviewed"],
      default: "pending",
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    reviewedAt: {
      type: Date,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    files: [
      {
        type: String, // URLs
      },
    ],
    links: [
      {
        type: String,
      },
    ],
    feedback: {
      type: String,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    xpEarned: {
      type: Number,
      required: true,
      default: 0,
    },
    coinsEarned: {
      type: Number,
      required: true,
      default: 0,
    },
    showInPortfolio: {
      type: Boolean,
      default: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes for efficient queries
submissionSchema.index({ userId: 1, createdAt: -1 });
submissionSchema.index({ challengeId: 1 });
submissionSchema.index({ skillPathId: 1, showInPortfolio: 1 });
submissionSchema.index({ userId: 1, challengeId: 1 }); // Prevent duplicate submissions
submissionSchema.index({ status: 1 });
submissionSchema.index({ isPublic: 1, showInPortfolio: 1 }); // Portfolio queries

const Submission: Model<SubmissionDocumentType> = model<SubmissionDocumentType>(
  "Submission",
  submissionSchema
);

export default Submission;

