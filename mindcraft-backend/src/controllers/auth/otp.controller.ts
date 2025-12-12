import { sendOTPEmail } from "@/services/email/email.service";
import { createOTP, verifyOTP, isEmailVerified } from "@/services/otp/otp.service";
import { findAccountS } from "@/services/auth/auth.service";
import { AppError } from "@/utils/error/appError";
import { Request, Response } from "express";

export const sendOTP = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("Email is required.", 400);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError("Invalid email format.", 400);
  }

  // Check if email is already registered
  const existingAccount = await findAccountS({ email });
  if (existingAccount) {
    throw new AppError("Email already registered.", 409);
  }

  // Generate and save OTP
  const otpCode = await createOTP(email);

  // Send OTP via email
  await sendOTPEmail(email, otpCode);

  res.status(200).json({
    message: "OTP sent successfully to your email.",
  });
};

export const verifyOTPCode = async (req: Request, res: Response): Promise<void> => {
  const { email, code } = req.body;

  if (!email) {
    throw new AppError("Email is required.", 400);
  }

  if (!code) {
    throw new AppError("OTP code is required.", 400);
  }

  // Verify OTP
  const isValid = await verifyOTP(email, code);

  if (!isValid) {
    throw new AppError("Invalid or expired OTP code.", 400);
  }

  res.status(200).json({
    message: "Email verified successfully.",
    verified: true,
  });
};

export const checkEmailVerification = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("Email is required.", 400);
  }

  const verified = await isEmailVerified(email);

  res.status(200).json({
    verified,
  });
};

