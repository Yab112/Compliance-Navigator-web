"use client";

import { useEffect } from "react";
import { useGetCurrentUser } from "@/api/auth";
import { useUserStore } from "@/store";
import { getAccessToken } from "@/lib/auth-token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useUserStore();
  const hasToken = typeof window !== "undefined" && !!getAccessToken();
  const { currentUser, isError } = useGetCurrentUser(hasToken);

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      return;
    }
    if (isError && hasToken) {
      setUser(null);
    }
  }, [currentUser, isError, hasToken, setUser]);

  return <>{children}</>;
}
