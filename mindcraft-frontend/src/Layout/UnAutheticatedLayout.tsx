import { useAuthStore } from "@/stores/auth/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";

const UnAuthenticatedLayout = () => {
  const { authUser } = useAuthStore();
  if (authUser) {
    return <Navigate to="/home/dashboard" replace />;
  }
  return (
    <div className="min-h-screen w-full">
      <Outlet />
    </div>
  );
};

export default UnAuthenticatedLayout;
