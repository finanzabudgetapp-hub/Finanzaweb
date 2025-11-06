import { useMutation } from "@tanstack/react-query";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toast } from "sonner";

import userService, { type SignInReq } from "@/api/services/userService";
import type { UserInfo, UserToken } from "#/entity";
import { StorageEnum } from "#/enum";

type UserStore = {
  userInfo: Partial<UserInfo>;
  userToken: Partial<UserToken>;
  actions: {
    setUserInfo: (userInfo: UserInfo) => void;
    setUserToken: (token: UserToken) => void;
    clearUserInfoAndToken: () => void;
  };
};

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userInfo: {},
      userToken: {},
      actions: {
        setUserInfo: (userInfo) => set({ userInfo }),
        setUserToken: (userToken) => set({ userToken }),
        clearUserInfoAndToken: () => set({ userInfo: {}, userToken: {} }),
      },
    }),
    {
      name: "userStore",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        [StorageEnum.UserInfo]: state.userInfo,
        [StorageEnum.UserToken]: state.userToken,
      }),
    }
  )
);

export const useUserInfo = () => useUserStore((state) => state.userInfo);
export const useUserToken = () => useUserStore((state) => state.userToken);
export const useUserPermissions = () => useUserStore((state) => state.userInfo.permissions || []);
export const useUserRoles = () => useUserStore((state) => state.userInfo.roles || []);
export const useUserActions = () => useUserStore((state) => state.actions);

export const useSignIn = () => {
  const { setUserToken, setUserInfo } = useUserActions();

  const signInMutation = useMutation({
    mutationFn: userService.signin,
  });

  const signIn = async (data: SignInReq) => {
    try {
      const res = await signInMutation.mutateAsync(data);

      if (!res || !res.user || !res.accessToken) {
        throw new Error("Invalid sign-in response from server.");
      }

      const { user, accessToken, refreshToken } = res;

      // ✅ Save user data and token
      setUserInfo(user);
      setUserToken({ accessToken, refreshToken });

      toast.success(`Welcome back, ${user.username || "User"}!`, {
        position: "top-center",
      });

      return res;
    } catch (err: any) {
      toast.error(err.message || "Sign-in failed. Please try again.", {
        position: "top-center",
      });
      throw err;
    }
  };

  return signIn;
};

export default useUserStore;
