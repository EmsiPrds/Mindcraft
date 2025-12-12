import { UserDocumentType } from "@/types/models/user.type";
import { model, Model, Schema } from "mongoose";

const userSchema = new Schema<UserDocumentType>(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      unique: true,
    },
    xp: {
      type: Number,
      default: 0,
      min: 0,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    coins: {
      type: Number,
      default: 0,
      min: 0,
    },
    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastChallengeDate: {
      type: Date,
    },
    selectedSkillPath: {
      type: Schema.Types.ObjectId,
      ref: "SkillPath",
    },
    completedChallenges: {
      type: Number,
      default: 0,
      min: 0,
    },
    badges: [
      {
        type: Schema.Types.ObjectId,
        ref: "Badge",
      },
    ],
    achievements: [
      {
        type: Schema.Types.ObjectId,
        ref: "Achievement",
      },
    ],
  },
  { timestamps: true }
);

// Index for leaderboard queries
userSchema.index({ xp: -1 });
userSchema.index({ currentStreak: -1 });
userSchema.index({ level: -1 });

const User: Model<UserDocumentType> = model<UserDocumentType>("User", userSchema);

export default User;

