import { motion } from "framer-motion";
import { Target, Trophy, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen lg:h-screen w-full minecraft-bg overflow-y-auto lg:overflow-hidden">
      <div className="flex flex-col min-h-screen lg:h-screen">
        {/* Navbar */}
        <header className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-3 xl:py-4 bg-[#4A4A4A] border-b-2 sm:border-b-3 md:border-b-4 border-[#1A1A1A] shrink-0">
          <div className="max-w-7xl mx-auto flex justify-between items-center gap-2 sm:gap-4">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white minecraft-title truncate"
            >
              <span className="text-[#7CB342]">Mind</span>
              <span className="text-[#FFD700]">Craft</span>
            </motion.h1>

            <motion.nav
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 items-center shrink-0"
            >
              <Link
                to="/auth/login"
                className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 lg:px-6 lg:py-3 minecraft-button bg-[#616161] hover:bg-[#4A4A4A] text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg whitespace-nowrap"
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 lg:px-6 lg:py-3 minecraft-button bg-[#7CB342] hover:bg-[#689F38] text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg whitespace-nowrap"
              >
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
              </Link>
            </motion.nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-3 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-2 xl:py-3 min-h-0 ">
          <div className="max-w-6xl mx-auto text-center w-full flex flex-col items-center gap-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-2 xl:space-y-3"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white leading-tight minecraft-title px-2">
                Level Up Your Skills
                <br />
                <span className="text-[#FFD700]">One Challenge at a Time</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-sm xl:text-base 2xl:text-lg text-[#E8F5E9] max-w-3xl mx-auto px-2 sm:px-4">
                Master new skills through daily AI-generated challenges. Build
                habits, earn rewards, and track your progress in a gamified
                learning experience.
              </p>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center items-center pt-1 sm:pt-2 lg:pt-1 xl:pt-2 px-2 sm:px-4">
                <Link
                  to="/auth/register"
                  className="px-4 sm:px-6 py-2 sm:py-3 md:px-8 md:py-4 lg:px-6 lg:py-3 minecraft-button bg-[#7CB342] hover:bg-[#689F38] text-white font-bold text-sm sm:text-base md:text-lg lg:text-base xl:text-lg w-full sm:w-auto"
                >
                  Start Learning Free
                </Link>
                <Link
                  to="/auth/login"
                  className="px-4 sm:px-6 py-2 sm:py-3 md:px-8 md:py-4 lg:px-6 lg:py-3 minecraft-button bg-[#616161] hover:bg-[#4A4A4A] text-white font-bold text-sm sm:text-base md:text-lg lg:text-base xl:text-lg w-full sm:w-auto"
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-2 xl:gap-3 mt-4 sm:mt-6 md:mt-8 lg:mt-2 xl:mt-3 px-2 sm:px-4 max-w-5xl mx-auto"
            >
              <div className="minecraft-card bg-[#4A4A4A] p-2.5 sm:p-3 md:p-4 lg:p-2 xl:p-2.5 hover:bg-[#5A5A5A] transition">
                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 minecraft-block bg-[#7CB342] flex items-center justify-center mb-1 sm:mb-1.5 md:mb-2 lg:mb-1 xl:mb-1.5 mx-auto">
                  <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 xl:w-4.5 xl:h-4.5 2xl:w-5 2xl:h-5 text-white" />
                </div>
                <h3 className="text-xs sm:text-sm md:text-base lg:text-xs xl:text-sm 2xl:text-base font-bold text-white mb-1 sm:mb-1.5 lg:mb-0.5 xl:mb-1 minecraft-title">
                  Daily Challenges
                </h3>
                <p className="text-gray-200 text-xs sm:text-xs md:text-sm lg:text-xs xl:text-xs 2xl:text-xs leading-relaxed">
                  Receive personalized challenges every day tailored to your
                  skill level and learning path
                </p>
              </div>

              <div className="minecraft-card bg-[#4A4A4A] p-2.5 sm:p-3 md:p-4 lg:p-2 xl:p-2.5 hover:bg-[#5A5A5A] transition">
                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 minecraft-block bg-[#FFD700] flex items-center justify-center mb-1 sm:mb-1.5 md:mb-2 lg:mb-1 xl:mb-1.5 mx-auto">
                  <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 xl:w-4.5 xl:h-4.5 2xl:w-5 2xl:h-5 text-[#1A1A1A]" />
                </div>
                <h3 className="text-xs sm:text-sm md:text-base lg:text-xs xl:text-sm 2xl:text-base font-bold text-white mb-1 sm:mb-1.5 lg:mb-0.5 xl:mb-1 minecraft-title">
                  Gamified Learning
                </h3>
                <p className="text-gray-200 text-xs sm:text-xs md:text-sm lg:text-xs xl:text-xs 2xl:text-xs leading-relaxed">
                  Earn XP, unlock badges, maintain streaks, and climb
                  leaderboards as you progress
                </p>
              </div>

              <div className="minecraft-card bg-[#4A4A4A] p-2.5 sm:p-3 md:p-4 lg:p-2 xl:p-2.5 hover:bg-[#5A5A5A] transition">
                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 minecraft-block bg-[#87CEEB] flex items-center justify-center mb-1 sm:mb-1.5 md:mb-2 lg:mb-1 xl:mb-1.5 mx-auto">
                  <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 xl:w-4.5 xl:h-4.5 2xl:w-5 2xl:h-5 text-[#1A1A1A]" />
                </div>
                <h3 className="text-xs sm:text-sm md:text-base lg:text-xs xl:text-sm 2xl:text-base font-bold text-white mb-1 sm:mb-1.5 lg:mb-0.5 xl:mb-1 minecraft-title">
                  AI-Powered
                </h3>
                <p className="text-gray-200 text-xs sm:text-xs md:text-sm lg:text-xs xl:text-xs 2xl:text-xs leading-relaxed">
                  Get intelligent challenges and feedback powered by AI to
                  accelerate your learning
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full px-3 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-3 xl:py-4 bg-[#4A4A4A] border-t-2 sm:border-t-3 md:border-t-4 border-[#1A1A1A] shrink-0">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-300 text-sm sm:text-base md:text-lg lg:text-sm xl:text-base">
              © {new Date().getFullYear()} MindCraft. Built with passion 🚀
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
