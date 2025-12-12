import axiosInstance from "@/axios/axiosInstance";
import type { BadgeType } from "@/types/badge/badge.type";

export const getAllBadgesApi = async (): Promise<BadgeType[]> => {
  const response = await axiosInstance.get("/badges");
  return response.data.data;
};

export const getUserBadgesApi = async (): Promise<BadgeType[]> => {
  const response = await axiosInstance.get("/badges/user/my-badges");
  return response.data.data;
};

