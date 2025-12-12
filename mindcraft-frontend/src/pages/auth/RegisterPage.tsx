import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import TextField from "@/components/custom/TextField";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import type { AccountType } from "@/types/auth/auth.type";
import { motion } from "framer-motion";
import { ArrowLeft, AtSign, Eye, EyeOff, Lock, Mail, User, Shield, CheckCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const { registerccount, sendOTP, verifyOTP, checkEmailVerification, loading } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState<Partial<AccountType>>({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    email: "",
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) {
      return;
    }

    const success = await sendOTP(form.email);
    if (success) {
      setOtpSent(true);
      setStep("otp");
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !otpCode) {
      return;
    }

    const success = await verifyOTP(form.email, otpCode);
    if (success) {
      setEmailVerified(true);
      await handleRegister();
    }
  };

  const handleRegister = async () => {
    const success = await registerccount(form);

    if (success) {
      setForm({
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: "",
        email: "",
        username: "",
        password: "",
      });
      navigate("/auth/login");
    }
  };

  // Check if email is already verified when component mounts
  useEffect(() => {
    const checkVerification = async () => {
      if (form.email) {
        const verified = await checkEmailVerification(form.email);
        if (verified) {
          setEmailVerified(true);
        }
      }
    };
    checkVerification();
  }, [form.email, checkEmailVerification]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 py-6 sm:py-8">
      <motion.div
        className="relative z-10 w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Card */}
        <div className="bg-gray-800 rounded-3xl shadow-2xl p-8 sm:p-10 border border-purple-500/20 relative">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <Link to={"/"} className="inline-block mb-3">
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                Mind<span className="text-purple-400">Craft</span>
              </h1>
            </Link>
            <p className="text-purple-200 text-sm sm:text-base">
              Create your account and start your learning journey
            </p>
          </motion.div>

          {/* Form */}
          <form
            className="w-full space-y-5"
            autoComplete="off"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Name Fields - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <TextField
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  icon={<User className="w-5 h-5" />}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
              >
                <TextField
                  name="middleName"
                  placeholder="Middle Name (Optional)"
                  value={form.middleName}
                  onChange={handleChange}
                  icon={<User className="w-5 h-5" />}
                />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <TextField
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  icon={<User className="w-5 h-5" />}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
              >
                <TextField
                  name="suffix"
                  placeholder="Suffix (Optional)"
                  value={form.suffix}
                  onChange={handleChange}
                  icon={<User className="w-5 h-5" />}
                />
              </motion.div>
            </div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <div className="relative">
                <TextField
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={step === "otp" || emailVerified}
                  icon={<Mail className="w-5 h-5" />}
                />
                {emailVerified && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-xs font-semibold">Verified</span>
                  </div>
                )}
              </div>
              {step === "form" && !emailVerified && form.email && (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={loading || !form.email}
                  className="mt-2 text-sm text-purple-400 hover:text-purple-300 font-medium hover:underline transition-colors disabled:opacity-50"
                >
                  Send verification code
                </button>
              )}
            </motion.div>

            {/* OTP Verification Step */}
            {step === "otp" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-5 border border-purple-500/30"
              >
                <p className="text-purple-200 text-sm mb-4">
                  Enter the 6-digit code sent to <strong className="text-white">{form.email}</strong>
                </p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white text-center text-xl font-mono tracking-widest placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <motion.button
                    type="button"
                    onClick={handleVerifyOTP}
                    disabled={loading || otpCode.length !== 6}
                    whileTap={{ scale: 0.98 }}
                    className={`px-6 py-3 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg transition-all ${
                      loading || otpCode.length !== 6
                        ? "cursor-not-allowed opacity-70"
                        : "cursor-pointer"
                    }`}
                  >
                    Verify
                  </motion.button>
                </div>
                {otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="mt-3 text-sm text-purple-400 hover:text-purple-300 font-medium hover:underline transition-colors disabled:opacity-50"
                  >
                    Resend code
                  </button>
                )}
              </motion.div>
            )}

            {/* Username */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
            >
              <TextField
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
                icon={<AtSign className="w-5 h-5" />}
              />
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <TextField
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                icon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    tabIndex={-1}
                    className="hover:text-gray-400 transition-colors"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                }
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
            >
              <motion.button
                disabled={loading || !emailVerified}
                type="submit"
                onClick={handleRegister}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-xl font-bold text-white text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg transition-all ${
                  loading || !emailVerified
                    ? "cursor-not-allowed opacity-70"
                    : "cursor-pointer"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSmall />
                  </div>
                ) : emailVerified ? (
                  "Create Account →"
                ) : (
                  "Verify Email First"
                )}
              </motion.button>
            </motion.div>

            {/* Login link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="text-center pt-2"
            >
              <p className="text-gray-400 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-purple-400 hover:text-purple-300 font-semibold hover:underline transition-colors"
                  onClick={() => navigate("/auth/login")}
                >
                  Login here
                </button>
              </p>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
