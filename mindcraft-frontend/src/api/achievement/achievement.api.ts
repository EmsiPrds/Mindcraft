import axiosInstance from "@/axios/axiosInstance";
import type { AchievementType } from "@/types/achievement/achievement.type";

export const getAllAchievementsApi = async (): Promise<AchievementType[]> => {
  const response = await axiosInstance.get("/achievements");
  return response.data.data;
};

export const getUserAchievementsApi = async (): Promise<AchievementType[]> => {
  const response = await axiosInstance.get("/achievements/user/my-achievements");
  return response.data.data;
};

