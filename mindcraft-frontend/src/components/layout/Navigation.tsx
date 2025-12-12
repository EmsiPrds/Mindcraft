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
    <nav className="bg-gray-800 border-t border-gray-700 fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition ${
                  active
                    ? "text-purple-400 bg-purple-600/20"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={logout}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition text-gray-400 hover:text-red-400"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-xs font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

