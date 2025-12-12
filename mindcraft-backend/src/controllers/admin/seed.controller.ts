import type { CustomRequest, Response } from "@/types/express/express.type";
import { seedSkillPaths } from "@/scripts/seedSkillPaths";
import { seedChallenges } from "@/scripts/seedChallenges";
import { AppError } from "@/utils/error/appError";

/**
 * Seed skill paths (admin only)
 */
export const seedSkillPathsController = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  // TODO: Add admin check
  // if (!req.account?.isAdmin) {
  //   throw new AppError("Admin access required", 403);
  // }

  try {
    await seedSkillPaths();
    res.status(200).json({
      message: "Skill paths seeded successfully",
    });
  } catch (error) {
    throw new AppError("Failed to seed skill paths", 500);
  }
};

/**
 * Seed challenges (admin only)
 */
export const seedChallengesController = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  // TODO: Add admin check
  // if (!req.account?.isAdmin) {
  //   throw new AppError("Admin access required", 403);
  // }

  try {
    await seedChallenges();
    res.status(200).json({
      message: "Challenges seeded successfully",
    });
  } catch (error) {
    throw new AppError("Failed to seed challenges", 500);
  }
};

/**
 * Seed everything (skill paths + challenges)
 */
export const seedAllController = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  // TODO: Add admin check
  // if (!req.account?.isAdmin) {
  //   throw new AppError("Admin access required", 403);
  // }

  try {
    await seedSkillPaths();
    await seedChallenges();
    res.status(200).json({
      message: "All data seeded successfully",
    });
  } catch (error) {
    throw new AppError("Failed to seed data", 500);
  }
};

