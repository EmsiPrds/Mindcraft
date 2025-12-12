import axiosInstance from "@/axios/axiosInstance";

export const getGlobalLeaderboardXPApi = async (filters?: { limit?: number; skip?: number }) => {
  const response = await axiosInstance.get("/leaderboard/global/xp", { params: filters });
  return response.data.data;
};

export const getGlobalLeaderboardStreakApi = async (filters?: { limit?: number; skip?: number }) => {
  const response = await axiosInstance.get("/leaderboard/global/streak", { params: filters });
  return response.data.data;
};

export const getGlobalLeaderboardLevelApi = async (filters?: { limit?: number; skip?: number }) => {
  const response = await axiosInstance.get("/leaderboard/global/level", { params: filters });
  return response.data.data;
};

export const getSkillPathLeaderboardApi = async (skillPathId: string, filters?: { limit?: number; skip?: number }) => {
  const response = await axiosInstance.get(`/leaderboard/skill-path/${skillPathId}`, { params: filters });
  return response.data.data;
};

export const getUserGlobalRankApi = async (sortBy?: "xp" | "streak" | "level") => {
  const response = await axiosInstance.get("/leaderboard/user/rank", { 
    params: { sortBy },
    skipAuthRedirect: true, // Don't redirect on 401 - this is optional data
  } as any);
  return response.data.data;
};

export const getUserSkillPathRankApi = async (skillPathId: string) => {
  const response = await axiosInstance.get(`/leaderboard/user/rank/skill-path/${skillPathId}`);
  return response.data.data;
};

