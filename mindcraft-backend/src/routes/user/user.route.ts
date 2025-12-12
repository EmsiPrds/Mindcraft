import { Router } from "express";
import verifier from "@/middlewares/verifier";
import { findOrCreateUserS } from "@/services/user/user.service";
import type { CustomRequest, Response } from "@/types/express/express.type";
import { AppError } from "@/utils/error/appError";

const router = Router();

router.use(verifier);

router.get("/profile", async (req: CustomRequest, res: Response) => {
  if (!req.account) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await findOrCreateUserS(req.account._id.toString());
  res.status(200).json({
    message: "User profile retrieved successfully",
    data: user,
  });
});

export default router;

