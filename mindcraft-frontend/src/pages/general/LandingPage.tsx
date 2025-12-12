import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Target, Trophy, Zap, TrendingUp, Flame, Award } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full minecraft-bg overflow-y-auto">
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-[#4A4A4A] border-b-4 border-[#1A1A1A]">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold text-white minecraft-title"
            >
              <span className="text-[#7CB342]">Mind</span><span className="text-[#FFD700]">Craft</span>
            </motion.h1>

            <motion.nav
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex gap-2 sm:gap-3 md:gap-4 items-center"
            >
              <Link
                to="/auth/login"
                className="px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 minecraft-button bg-[#616161] hover:bg-[#4A4A4A] text-white font-bold text-base sm:text-lg"
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className="px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 minecraft-button bg-[#7CB342] hover:bg-[#689F38] text-white font-bold text-base sm:text-lg"
              >
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
              </Link>
            </motion.nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-6xl mx-auto text-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 sm:space-y-8"
            >
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight minecraft-title px-2">
                Level Up Your Skills
                <br />
                <span className="text-[#FFD700]">
                  One Challenge at a Time
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#E8F5E9] max-w-3xl mx-auto px-4">
                Master new skills through daily AI-generated challenges. Build habits, earn rewards, and track your progress in a gamified learning experience.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4 px-4">
                <Link
                  to="/auth/register"
                  className="px-6 py-3 sm:px-8 sm:py-4 minecraft-button bg-[#7CB342] hover:bg-[#689F38] text-white font-bold text-base sm:text-lg md:text-xl w-full sm:w-auto"
                >
                  Start Learning Free
                </Link>
                <Link
                  to="/auth/login"
                  className="px-6 py-3 sm:px-8 sm:py-4 minecraft-button bg-[#616161] hover:bg-[#4A4A4A] text-white font-bold text-base sm:text-lg md:text-xl w-full sm:w-auto"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 md:mt-16 px-4"
            >
              <div className="minecraft-card bg-[#4A4A4A] p-4 sm:p-6 md:p-8 hover:bg-[#5A5A5A] transition">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 minecraft-block bg-[#7CB342] flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                  <Target className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 minecraft-title">Daily Challenges</h3>
                <p className="text-gray-200 text-base sm:text-lg leading-relaxed">
                  Receive personalized challenges every day tailored to your skill level and learning path
                </p>
              </div>

              <div className="minecraft-card bg-[#4A4A4A] p-6 sm:p-8 hover:bg-[#5A5A5A] transition">
                <div className="w-16 h-16 minecraft-block bg-[#FFD700] flex items-center justify-center mb-4 mx-auto">
                  <Trophy className="w-8 h-8 text-[#1A1A1A]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 minecraft-title">Gamified Learning</h3>
                <p className="text-gray-200 text-lg leading-relaxed">
                  Earn XP, unlock badges, maintain streaks, and climb leaderboards as you progress
                </p>
              </div>

              <div className="minecraft-card bg-[#4A4A4A] p-6 sm:p-8 hover:bg-[#5A5A5A] transition sm:col-span-2 lg:col-span-1">
                <div className="w-16 h-16 minecraft-block bg-[#FF6B35] flex items-center justify-center mb-4 mx-auto">
                  <Flame className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 minecraft-title">Build Habits</h3>
                <p className="text-gray-200 text-lg leading-relaxed">
                  Track your daily streak and watch your skills grow with consistent practice
                </p>
              </div>

              <div className="minecraft-card bg-[#4A4A4A] p-6 sm:p-8 hover:bg-[#5A5A5A] transition">
                <div className="w-16 h-16 minecraft-block bg-[#4CAF50] flex items-center justify-center mb-4 mx-auto">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 minecraft-title">Track Progress</h3>
                <p className="text-gray-200 text-lg leading-relaxed">
                  Visualize your growth with detailed analytics and a portfolio of completed work
                </p>
              </div>

              <div className="minecraft-card bg-[#4A4A4A] p-6 sm:p-8 hover:bg-[#5A5A5A] transition">
                <div className="w-16 h-16 minecraft-block bg-[#87CEEB] flex items-center justify-center mb-4 mx-auto">
                  <Zap className="w-8 h-8 text-[#1A1A1A]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 minecraft-title">AI-Powered</h3>
                <p className="text-gray-200 text-lg leading-relaxed">
                  Get intelligent challenges and feedback powered by AI to accelerate your learning
                </p>
              </div>

              <div className="minecraft-card bg-[#4A4A4A] p-6 sm:p-8 hover:bg-[#5A5A5A] transition">
                <div className="w-16 h-16 minecraft-block bg-[#9C27B0] flex items-center justify-center mb-4 mx-auto">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 minecraft-title">Multiple Paths</h3>
                <p className="text-gray-200 text-lg leading-relaxed">
                  Choose from various skill paths: Design, Development, Writing, Photography, and more
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-[#4A4A4A] border-t-4 border-[#1A1A1A]">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-300 text-lg">
              © {new Date().getFullYear()} MindCraft. Built with passion 🚀
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
