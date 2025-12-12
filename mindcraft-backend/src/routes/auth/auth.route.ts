import { login, logout, register } from "@/controllers/auth/auth.controller";
import { sendOTP, verifyOTPCode, checkEmailVerification } from "@/controllers/auth/otp.controller";
import { Router } from "express";

const router = Router();

// OTP routes
router.post("/otp/send", sendOTP);
router.post("/otp/verify", verifyOTPCode);
router.post("/otp/check", checkEmailVerification);

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
