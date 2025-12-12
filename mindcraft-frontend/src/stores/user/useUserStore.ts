import { create } from "zustand";
import { getUserProfileApi } from "@/api/user/user.api";
import type { UserType } from "@/types/user/user.type";

type UserStateType = {
  user: UserType | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
};

export const useUserStore = create<UserStateType>((set) => ({
  user: null,
  loading: false,
  fetchUser: async () => {
    set({ loading: true });
    try {
      const user = await getUserProfileApi();
      set({ user, loading: false });
    } catch (error) {
      console.error("Error fetching user:", error);
      set({ loading: false });
    }
  },
}));

