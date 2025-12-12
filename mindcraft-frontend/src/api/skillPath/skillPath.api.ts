import axiosInstance from "@/axios/axiosInstance";
import type { SkillPathType, SkillPathProgressType } from "@/types/skillPath/skillPath.type";

export const getAllSkillPathsApi = async (): Promise<SkillPathType[]> => {
  const response = await axiosInstance.get("/skill-paths");
  return response.data.data;
};

export const getSkillPathByIdApi = async (skillPathId: string): Promise<SkillPathType> => {
  const response = await axiosInstance.get(`/skill-paths/${skillPathId}`);
  return response.data.data;
};

export const getUserCurrentSkillPathApi = async () => {
  const response = await axiosInstance.get("/skill-paths/user/current");
  return response.data.data;
};

export const getAllUserSkillPathProgressApi = async () => {
  const response = await axiosInstance.get("/skill-paths/user/progress");
  return response.data.data;
};

export const getUserSkillPathProgressApi = async (skillPathId: string): Promise<SkillPathProgressType> => {
  const response = await axiosInstance.get(`/skill-paths/user/progress/${skillPathId}`);
  return response.data.data;
};

export const selectSkillPathApi = async (skillPathId: string) => {
  const response = await axiosInstance.post("/skill-paths/select", { skillPathId });
  return response.data.data;
};

export const createSkillPathApi = async (data: {
  name: string;
  description: string;
  icon?: string;
  color?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedDuration?: number;
  isActive?: boolean;
  order?: number;
}): Promise<SkillPathType> => {
  const response = await axiosInstance.post("/skill-paths", data);
  return response.data.data;
};

