import { loginApi, logoutApi, registerApi, sendOTPApi, verifyOTPApi, checkEmailVerificationApi } from "@/api/auth/auth.api";
import type { AuthStateType } from "@/types/auth/auth.type";
import { showError } from "@/utils/error.util";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useAuthStore = create(
  persist<AuthStateType>(
    (set) => ({
      authUser: null,

      loading: false,

      registerccount: async ({
        firstName,
        middleName,
        lastName,
        suffix,
        email,
        username,
        password,
      }) => {
        set({ loading: true });
        try {
          await registerApi({
            firstName,
            middleName,
            lastName,
            suffix,
            email,
            username,
            password,
          });
          return true;
        } catch (error) {
          console.error("Error registering in account", error);
          showError(error);
          return false;
        } finally {
          set({ loading: false });
        }
      },
      loginAccount: async ({ username, password }) => {
        set({ loading: true });
        try {
          const response = await loginApi({ username, password });
          set({ authUser: response.data.user });
          return true;
        } catch (error) {
          console.error("Error logging in account", error);
          showError(error);
          return false;
        } finally {
          set({ loading: false });
        }
      },
      logout: async () => {
        set({ loading: true });
        try {
          await logoutApi();
          set({ authUser: null });
          localStorage.clear();
          sessionStorage.clear();
        } catch (error) {
          console.error("Error logging out", error);
          showError(error);
        } finally {
          set({ loading: false });
        }
      },
      sendOTP: async (email: string) => {
        set({ loading: true });
        try {
          await sendOTPApi(email);
          return true;
        } catch (error) {
          console.error("Error sending OTP", error);
          showError(error);
          return false;
        } finally {
          set({ loading: false });
        }
      },
      verifyOTP: async (email: string, code: string) => {
        set({ loading: true });
        try {
          await verifyOTPApi(email, code);
          return true;
        } catch (error) {
          console.error("Error verifying OTP", error);
          showError(error);
          return false;
        } finally {
          set({ loading: false });
        }
      },
      checkEmailVerification: async (email: string) => {
        try {
          const response = await checkEmailVerificationApi(email);
          return response.data.verified;
        } catch (error) {
          console.error("Error checking email verification", error);
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
