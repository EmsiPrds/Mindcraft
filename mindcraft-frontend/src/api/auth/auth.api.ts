import axiosInstance from "@/axios/axiosInstance";
import type { AccountType } from "@/types/auth/auth.type";

export const registerApi = async ({
  firstName,
  middleName,
  lastName,
  suffix,
  email,
  username,
  password,
}: Partial<AccountType>) => {
  const response = await axiosInstance.post("/auth/register", {
    firstName,
    middleName,
    lastName,
    suffix,
    email,
    username,
    password,
  });
  return response;
};

export const loginApi = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const response = await axiosInstance.post("/auth/login", {
    username,
    password,
  });
  return response;
};

export const logoutApi = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response;
};

export const sendOTPApi = async (email: string) => {
  const response = await axiosInstance.post("/auth/otp/send", { email });
  return response;
};

export const verifyOTPApi = async (email: string, code: string) => {
  const response = await axiosInstance.post("/auth/otp/verify", { email, code });
  return response;
};

export const checkEmailVerificationApi = async (email: string) => {
  const response = await axiosInstance.post("/auth/otp/check", { email });
  return response;
};