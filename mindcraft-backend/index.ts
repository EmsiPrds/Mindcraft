import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import "dotenv/config";
import initDB from "@/db/db.connect";
import globalErrorHandler from "@/middlewares/globalErrorHandler";

// Import routes
import authRoutes from "@/routes/auth/auth.route";
import userRoutes from "@/routes/user/user.route";
import skillPathRoutes from "@/routes/skillPath/skillPath.route";
import challengeRoutes from "@/routes/challenge/challenge.route";
import submissionRoutes from "@/routes/submission/submission.route";
import badgeRoutes from "@/routes/badge/badge.route";
import achievementRoutes from "@/routes/achievement/achievement.route";
import leaderboardRoutes from "@/routes/leaderboard/leaderboard.route";
import adminRoutes from "@/routes/admin/admin.route";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "MindCraft API is running!" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skill-paths", skillPathRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/admin", adminRoutes);

// Global error handler (must be last)
app.use(globalErrorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await initDB();

    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

