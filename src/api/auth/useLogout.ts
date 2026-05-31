"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import useMutationFunc from "@/hooks/use-mutation";
import { MTD } from "@/lib/constants/methods";
import { apiPaths } from "@/lib/constants/api-paths";
import { clearAccessToken, getAccessToken } from "@/lib/auth-token";
import { isMockToken } from "@/lib/mock-auth";
import { useUserStore } from "@/store";
import type { APIResponse } from "@/types/global";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();

  const { mutateAsync, isPending } = useMutationFunc<APIResponse<null>, void>({
    onSuccess: () => {
      clearAccessToken();
      setUser(null);
      queryClient.clear();
      router.push("/");
    },
    onError: () => {
      clearAccessToken();
      setUser(null);
      queryClient.clear();
      router.push("/");
    },
  });

  const logout = async () => {
    if (!isMockToken(getAccessToken())) {
      try {
        await mutateAsync({
          url: apiPaths.auth.logout,
          method: MTD.POST,
        });
        return;
      } catch {
        // API may be offline during dev
      }
    }
    clearAccessToken();
    setUser(null);
    queryClient.clear();
    router.push("/");
  };

  return {
    logout,
    isLoggingOut: isPending,
  };
};
