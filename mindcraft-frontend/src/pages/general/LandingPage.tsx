import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Target, Trophy, Zap, TrendingUp, Flame, Award } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 overflow-y-auto">
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl sm:text-3xl font-bold text-white"
            >
              Mind<span className="text-purple-400">Craft</span>
            </motion.h1>

            <motion.nav
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex gap-3 sm:gap-4 items-center"
            >
              <Link
                to="/auth/login"
                className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold transition border border-gray-700"
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold transition shadow-lg"
              >
                Get Started
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
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Level Up Your Skills
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  One Challenge at a Time
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto px-4">
                Master new skills through daily AI-generated challenges. Build habits, earn rewards, and track your progress in a gamified learning experience.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link
                  to="/auth/register"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg shadow-2xl transition w-full sm:w-auto"
                >
                  Start Learning Free
                </Link>
                <Link
                  to="/auth/login"
                  className="px-8 py-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-lg border border-gray-700 transition w-full sm:w-auto"
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 sm:mt-16"
            >
              <div className="bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-500/20 hover:border-purple-400/40 transition">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Daily Challenges</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Receive personalized challenges every day tailored to your skill level and learning path
                </p>
              </div>

              <div className="bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-blue-500/20 hover:border-blue-400/40 transition">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Gamified Learning</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Earn XP, unlock badges, maintain streaks, and climb leaderboards as you progress
                </p>
              </div>

              <div className="bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-yellow-500/20 hover:border-yellow-400/40 transition sm:col-span-2 lg:col-span-1">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Flame className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Build Habits</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Track your daily streak and watch your skills grow with consistent practice
                </p>
              </div>

              <div className="bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-green-500/20 hover:border-green-400/40 transition">
                <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Track Progress</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Visualize your growth with detailed analytics and a portfolio of completed work
                </p>
              </div>

              <div className="bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-500/20 hover:border-pink-400/40 transition">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-600 to-rose-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">AI-Powered</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Get intelligent challenges and feedback powered by AI to accelerate your learning
                </p>
              </div>

              <div className="bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-indigo-500/20 hover:border-indigo-400/40 transition">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Multiple Paths</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Choose from various skill paths: Design, Development, Writing, Photography, and more
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              © {new Date().getFullYear()} MindCraft. Built with passion 🚀
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
