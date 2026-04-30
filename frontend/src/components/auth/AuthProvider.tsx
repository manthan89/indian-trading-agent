"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/lib/store-auth";
import { useRouter } from "next/navigation";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { initialize, initialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}
