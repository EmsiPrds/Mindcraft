import { AppError } from "@/utils/error/appError";
import type { NextFunction, Request, Response } from "express";

const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
    });
    return;
  }

  if (err instanceof Error) {
    console.error("Unhandled error:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
    res.status(500).json({
      error: err.message || "Internal Server Error",
    });
    return;
  }

  console.error("Unknown error:", err);
  res.status(500).json({
    error: "Internal Server Error",
  });
};

export default globalErrorHandler;
