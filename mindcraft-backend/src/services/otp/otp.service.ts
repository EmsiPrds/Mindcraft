import OTP from "@/models/otp.model";
import { AppError } from "@/utils/error/appError";

// Generate a 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create and save OTP
export const createOTP = async (email: string): Promise<string> => {
  // Delete any existing OTPs for this email
  await OTP.deleteMany({ email, verified: false });

  const code = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await OTP.create({
    email,
    code,
    expiresAt,
    verified: false,
  });

  return code;
};

// Verify OTP
export const verifyOTP = async (email: string, code: string): Promise<boolean> => {
  const otp = await OTP.findOne({
    email,
    code,
    verified: false,
    expiresAt: { $gt: new Date() },
  });

  if (!otp) {
    return false;
  }

  // Mark OTP as verified
  otp.verified = true;
  await otp.save();

  return true;
};

// Check if email is verified
export const isEmailVerified = async (email: string): Promise<boolean> => {
  const verifiedOTP = await OTP.findOne({
    email,
    verified: true,
  }).sort({ createdAt: -1 });

  return !!verifiedOTP;
};

// Delete verified OTPs for an email (cleanup)
export const deleteVerifiedOTPs = async (email: string): Promise<void> => {
  await OTP.deleteMany({ email, verified: true });
};

