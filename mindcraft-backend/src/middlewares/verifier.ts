import Account from "@/models/account.model";
import { CustomRequest } from "@/types/express/express.type";
import type { NextFunction, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";

const verifier = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No Token Provided" });
    }

    // Type assertion: assume decoded has a accountId property
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload & { accountId: string };

    if (!decoded || !decoded.accountId) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    const account = await Account.findById(decoded.accountId).select(
      "-password"
    );

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    // Assign account to the request object
    req.account = account;

    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error in verifier middleware:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(500).json({ error: "Internal Server Error " });
    }
  }
};

export default verifier;
