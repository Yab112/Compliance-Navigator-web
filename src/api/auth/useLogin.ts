"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import useMutationFunc from "@/hooks/use-mutation";
import { MTD } from "@/lib/constants/methods";
import { apiPaths } from "@/lib/constants/api-paths";
import { setAccessToken } from "@/lib/auth-token";
import {
  isMockCredentials,
  MOCK_TOKEN,
  MOCK_USER,
} from "@/lib/mock-auth";
import { useUserStore } from "@/store";
import type { TokenResponse } from "@/lib/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();

  const { mutateAsync, isPending } = useMutationFunc<
    TokenResponse,
    URLSearchParams
  >({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });

  const login = async (credentials: LoginCredentials) => {
    if (isMockCredentials(credentials.email, credentials.password)) {
      setAccessToken(MOCK_TOKEN);
      setUser(MOCK_USER);
      router.push("/roadmap");
      return { access_token: MOCK_TOKEN, type: "Bearer" };
    }

    const form = new URLSearchParams();
    form.set("username", credentials.email);
    form.set("password", credentials.password);

    const data = await mutateAsync({
      url: apiPaths.users.login,
      method: MTD.POST,
      body: form,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    setAccessToken(data.access_token);
    queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    router.push("/roadmap");
    return data;
  };

  return {
    login,
    isLoggingIn: isPending,
  };
};
