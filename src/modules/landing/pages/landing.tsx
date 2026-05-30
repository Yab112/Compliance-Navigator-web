"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUserStore } from "@/store";
import { useMutation } from "@tanstack/react-query";
import { endpoints } from "@/config";
import { AuthServices } from "@/services";
import { aboutProduct } from "@/content/about";

export function LandingPage() {
  const { user, setUser } = useUserStore();

  const logoutMutation = useMutation({
    mutationKey: [endpoints.auth.logout.query],
    mutationFn: AuthServices.logout,
    onSuccess: () => {
      setUser(null);
    },
  });

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center gap-8 py-16">
      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm uppercase tracking-wide">
          {aboutProduct.name}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          {aboutProduct.tagline}
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          {aboutProduct.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {user ? (
          <>
            <p className="text-sm">
              Signed in as <span className="font-medium">{user.fullname}</span>
            </p>
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              loading={logoutMutation.isPending}
            >
              Sign out
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button>Sign in</Button>
          </Link>
        )}
        <Link href="/about">
          <Button variant="outline">About</Button>
        </Link>
      </div>
    </main>
  );
}
