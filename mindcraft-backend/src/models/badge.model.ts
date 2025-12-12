import { BadgeDocumentType } from "@/types/models/badge.type";
import { model, Model, Schema } from "mongoose";

const badgeSchema = new Schema<BadgeDocumentType>(
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
    rarity: {
      type: String,
      enum: ["common", "rare", "epic", "legendary"],
      default: "common",
    },
    category: {
      type: String,
      enum: ["streak", "challenge", "skill", "special", "milestone"],
      required: true,
    },
    condition: {
      type: String,
    },
    xpBonus: {
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

// Index for active badges
badgeSchema.index({ isActive: 1, category: 1 });

const Badge: Model<BadgeDocumentType> = model<BadgeDocumentType>("Badge", badgeSchema);

export default Badge;

