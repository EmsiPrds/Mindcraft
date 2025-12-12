import axiosInstance from "@/axios/axiosInstance";
import type { ChallengeType, TodaysChallengeType } from "@/types/challenge/challenge.type";

export const getTodaysChallengeApi = async (): Promise<TodaysChallengeType> => {
  const response = await axiosInstance.get("/challenges/today");
  return response.data.data;
};

export const getChallengeByIdApi = async (challengeId: string): Promise<ChallengeType> => {
  const response = await axiosInstance.get(`/challenges/${challengeId}`);
  return response.data.data;
};

export const getChallengeProgressApi = async (skillPathId: string) => {
  const response = await axiosInstance.get(`/challenges/progress/${skillPathId}`);
  return response.data.data;
};

export const completeChallengeApi = async (
  challengeId: string,
  data: {
    title?: string;
    description?: string;
    files: string[];
    links?: string[];
  }
) => {
  const response = await axiosInstance.post(`/challenges/${challengeId}/complete`, data);
  return response.data.data;
};

export const getAllChallengesApi = async (filters?: {
  skillPathId?: string;
  difficulty?: string;
  isActive?: boolean;
  limit?: number;
  skip?: number;
}) => {
  const response = await axiosInstance.get("/challenges", { params: filters });
  return response.data.data;
};

export const generateAIChallengeApi = async (data: {
  title: string;
  description: string;
  instructions: string;
  skillPathId: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  dayNumber: number;
  xpReward?: number;
  coinReward?: number;
  estimatedTime?: number;
  tags?: string[];
  exampleImages?: string[];
}): Promise<ChallengeType> => {
  const response = await axiosInstance.post("/challenges/ai/generate", data);
  return response.data.data;
};

export const triggerAIChallengeGenerationApi = async (skillPathId: string): Promise<ChallengeType> => {
  const response = await axiosInstance.post("/challenges/ai/trigger", { skillPathId });
  return response.data.data;
};

