import { ChallengeDocumentType } from "@/types/models/challenge.type";
import { model, Model, Schema } from "mongoose";

const challengeSchema = new Schema<ChallengeDocumentType>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
      required: true,
    },
    skillPathId: {
      type: Schema.Types.ObjectId,
      ref: "SkillPath",
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    dayNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    xpReward: {
      type: Number,
      required: true,
      min: 0,
      default: 100,
    },
    coinReward: {
      type: Number,
      required: true,
      min: 0,
      default: 10,
    },
    estimatedTime: {
      type: Number, // Minutes
    },
    tags: [
      {
        type: String,
      },
    ],
    exampleImages: [
      {
        type: String, // URLs
      },
    ],
    aiGenerated: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
challengeSchema.index({ skillPathId: 1, dayNumber: 1 });
challengeSchema.index({ skillPathId: 1, isActive: 1 });
challengeSchema.index({ difficulty: 1 });

const Challenge: Model<ChallengeDocumentType> = model<ChallengeDocumentType>(
  "Challenge",
  challengeSchema
);

export default Challenge;

