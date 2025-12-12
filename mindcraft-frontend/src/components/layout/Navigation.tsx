import { Link, useLocation } from "react-router-dom";
import { Home, Target, Trophy, Image, Award, Star, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useUserStore } from "@/stores/user/useUserStore";

const Navigation = () => {
  const location = useLocation();
  const { logout } = useAuthStore();
  const { user } = useUserStore();

  const navItems = [
    { path: "/home/dashboard", icon: Home, label: "Dashboard" },
    { path: "/home/skill-paths", icon: Target, label: "Paths" },
    { path: "/home/portfolio", icon: Image, label: "Portfolio" },
    { path: "/home/leaderboard", icon: Trophy, label: "Leaderboard" },
    { path: "/home/badges", icon: Award, label: "Badges" },
    { path: "/home/achievements", icon: Star, label: "Achievements" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <nav className="bg-[#4A4A4A] border-t-2 sm:border-t-4 border-[#1A1A1A] fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-around py-1.5 sm:py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 md:px-3 py-1.5 sm:py-2 minecraft-button transition ${
                  active
                    ? "text-[#FFD700] bg-[#616161]"
                    : "text-gray-300 hover:text-white bg-[#4A4A4A] hover:bg-[#5A5A5A]"
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <span className="text-xs sm:text-sm font-bold leading-tight">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={logout}
            className="flex flex-col items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 md:px-3 py-1.5 sm:py-2 minecraft-button bg-[#4A4A4A] hover:bg-[#5A5A5A] transition text-gray-300 hover:text-red-400"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            <span className="text-xs sm:text-sm font-bold leading-tight">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

