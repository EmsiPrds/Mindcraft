import axiosInstance from "@/axios/axiosInstance";
import type { UserType } from "@/types/user/user.type";

export const getUserProfileApi = async (): Promise<UserType> => {
  const response = await axiosInstance.get("/users/profile");
  return response.data.data;
};

