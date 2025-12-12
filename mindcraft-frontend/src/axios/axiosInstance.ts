import axios from "axios";
import { showError } from "@/utils/error.util";

// Normalize the API URL to handle trailing slashes
const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "";

const axiosInstance = axios.create({
  baseURL: `${apiUrl}/api`,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle specific error status codes
      if (error.response.status === 401) {
        // Check if this request should skip the redirect (for optional/graceful failures)
        const skipRedirect = error.config?.skipAuthRedirect === true;
        const requestUrl = error.config?.url || "";
        
        // Don't redirect for public leaderboard endpoints or optional calls
        const isPublicLeaderboard = requestUrl.includes("/leaderboard/global/") || 
                                    requestUrl.includes("/leaderboard/skill-path/");
        
        // Don't redirect for user rank calls (optional data)
        const isUserRank = requestUrl.includes("/leaderboard/user/rank");
        
        if (!skipRedirect && !isPublicLeaderboard && !isUserRank) {
          // Only redirect to login if we're on a protected route
          const currentPath = window.location.pathname;
          const isProtectedRoute = currentPath.startsWith("/home");
          
          if (isProtectedRoute) {
            // Unauthorized on protected route - clear auth and redirect to login
            // Clear localStorage for auth
            localStorage.removeItem("auth-storage");
            window.location.href = "/auth/login";
          }
        }
        // If skipRedirect is true, it's a public route, or optional call, just reject the promise (don't redirect)
      } else if (error.response.status === 403) {
        showError("You don't have permission to perform this action");
      } else if (error.response.status >= 500) {
        showError("Server error. Please try again later.");
      }
    } else if (error.request) {
      showError("Network error. Please check your connection.");
    } else {
      showError("An unexpected error occurred.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
