import axiosInstance from "@/axios/axiosInstance";
import type { SubmissionType } from "@/types/submission/submission.type";

export const getUserSubmissionsApi = async (filters?: {
  skillPathId?: string;
  status?: string;
  showInPortfolio?: boolean;
  limit?: number;
  skip?: number;
}) => {
  const response = await axiosInstance.get("/submissions/my-submissions", { params: filters });
  return response.data.data;
};

export const getUserPortfolioApi = async (filters?: {
  skillPathId?: string;
  limit?: number;
  skip?: number;
}) => {
  const response = await axiosInstance.get("/submissions/my-portfolio", { params: filters });
  return response.data.data;
};

export const getPublicPortfolioApi = async (filters?: {
  skillPathId?: string;
  userId?: string;
  limit?: number;
  skip?: number;
}) => {
  const response = await axiosInstance.get("/submissions/public", { params: filters });
  return response.data.data;
};

export const getSubmissionByIdApi = async (submissionId: string): Promise<SubmissionType> => {
  const response = await axiosInstance.get(`/submissions/${submissionId}`);
  return response.data.data;
};

export const updateSubmissionApi = async (submissionId: string, updates: Partial<SubmissionType>) => {
  const response = await axiosInstance.put(`/submissions/${submissionId}`, updates);
  return response.data.data;
};

export const deleteSubmissionApi = async (submissionId: string) => {
  const response = await axiosInstance.delete(`/submissions/${submissionId}`);
  return response.data;
};

export const togglePortfolioVisibilityApi = async (submissionId: string, showInPortfolio: boolean) => {
  const response = await axiosInstance.put(`/submissions/${submissionId}/portfolio-visibility`, {
    showInPortfolio,
  });
  return response.data.data;
};

export const togglePublicVisibilityApi = async (submissionId: string, isPublic: boolean) => {
  const response = await axiosInstance.put(`/submissions/${submissionId}/public-visibility`, {
    isPublic,
  });
  return response.data.data;
};

export const getUserSubmissionStatsApi = async () => {
  const response = await axiosInstance.get("/submissions/stats");
  return response.data.data;
};

