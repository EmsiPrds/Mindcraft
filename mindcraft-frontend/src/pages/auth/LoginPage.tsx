import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import TextField from "@/components/custom/TextField";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { motion } from "framer-motion";
import { ArrowLeft, AtSign, Eye, EyeOff, Lock } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface FormData {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { loginAccount, loading } = useAuthStore();

  const [form, setForm] = useState<FormData>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await loginAccount(form);

    if (success) {
      setForm({
        username: "",
        password: "",
      });
      navigate("/home/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        className="w-full max-w-md"
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
              Welcome back! Sign in to continue your learning journey
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <TextField
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
                autoFocus
                icon={<AtSign className="w-5 h-5" />}
              />
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
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
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <motion.button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-white text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg transition-all ${
                  loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"
                }`}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSmall />
                  </div>
                ) : (
                  "Sign In →"
                )}
              </motion.button>
            </motion.div>

            {/* Register link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="text-center pt-2"
            >
              <p className="text-gray-400 text-sm">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-purple-400 hover:text-purple-300 font-semibold hover:underline transition-colors"
                  onClick={() => navigate("/auth/register")}
                >
                  Register here
                </button>
              </p>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
