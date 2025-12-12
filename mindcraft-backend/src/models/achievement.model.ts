import { AchievementDocumentType } from "@/types/models/achievement.type";
import { model, Model, Schema } from "mongoose";

const achievementSchema = new Schema<AchievementDocumentType>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["milestone", "streak", "skill", "community", "special"],
      required: true,
    },
    requirement: {
      type: {
        type: String,
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
      skillPathId: {
        type: Schema.Types.ObjectId,
        ref: "SkillPath",
      },
    },
    xpReward: {
      type: Number,
      default: 0,
      min: 0,
    },
    coinReward: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for active achievements
achievementSchema.index({ isActive: 1, category: 1 });

const Achievement: Model<AchievementDocumentType> = model<AchievementDocumentType>(
  "Achievement",
  achievementSchema
);

export default Achievement;

