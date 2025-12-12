import { useAuthStore } from "@/stores/auth/useAuthStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useUserStore } from "@/stores/user/useUserStore";
import Navigation from "@/components/layout/Navigation";

const AuthenticatedLayout = () => {
  const { authUser } = useAuthStore();
  const { fetchUser } = useUserStore();
  const location = useLocation();

  useEffect(() => {
    if (authUser) {
      // Fetch user data, but don't fail if it errors (might be a token issue)
      fetchUser().catch((error) => {
        // Silently handle errors - don't redirect if fetchUser fails
        console.log("Could not fetch user profile:", error);
      });
    }
  }, [authUser, fetchUser]);

  if (!authUser) {
    return <Navigate to="/auth/login" replace />;
  }

  // Hide navigation on challenge page
  const hideNav = location.pathname.includes("/challenge/");
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 pb-20">
      <Outlet />
      {!hideNav && <Navigation />}
    </div>
  );
};

export default AuthenticatedLayout;
