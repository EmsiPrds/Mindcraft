import { Resend } from "resend";
import { AppError } from "@/utils/error/appError";

// Lazy initialization of Resend to avoid errors if API key is missing
let resend: Resend | null = null;

const getResend = (): Resend => {
  if (!process.env.RESEND_API_KEY) {
    throw new AppError("Email service is not configured. Please set RESEND_API_KEY in your .env file.", 500);
  }
  
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  
  return resend;
};

export const sendOTPEmail = async (email: string, otpCode: string): Promise<void> => {
  const resendInstance = getResend();

  const { data, error } = await resendInstance.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Auth10-tication <onboarding@resend.dev>",
    to: [email],
    subject: "Verify Your Email - OTP Code",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Auth10-tication</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Email Verification</h2>
            <p>Thank you for registering! Please use the following OTP code to verify your email address:</p>
            <div style="background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #667eea; font-size: 36px; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">${otpCode}</h1>
            </div>
            <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">If you didn't request this code, please ignore this email.</p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} Auth10-tication. All rights reserved.</p>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new AppError("Failed to send email. Please try again later.", 500);
  }

  if (!data) {
    throw new AppError("Email service returned no data.", 500);
  }
};

