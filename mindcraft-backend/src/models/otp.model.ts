import { model, Model, Schema } from "mongoose";

interface OTPDocumentType {
  email: string;
  code: string;
  expiresAt: Date;
  verified: boolean;
  createdAt: Date;
}

const otpSchema = new Schema<OTPDocumentType>(
  {
    email: { type: String, required: true, index: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-delete expired OTPs - TTL index
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP: Model<OTPDocumentType> = model<OTPDocumentType>("OTP", otpSchema);

export default OTP;
export type { OTPDocumentType };

