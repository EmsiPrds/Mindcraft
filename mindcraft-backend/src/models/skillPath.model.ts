import { SkillPathDocumentType } from "@/types/models/skillPath.type";
import { model, Model, Schema } from "mongoose";

const skillPathSchema = new Schema<SkillPathDocumentType>(
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
    },
    color: {
      type: String,
      default: "#6366f1", // Default indigo
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    estimatedDuration: {
      type: Number, // Days
    },
    totalChallenges: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for active paths
skillPathSchema.index({ isActive: 1, order: 1 });

const SkillPath: Model<SkillPathDocumentType> = model<SkillPathDocumentType>(
  "SkillPath",
  skillPathSchema
);

export default SkillPath;

