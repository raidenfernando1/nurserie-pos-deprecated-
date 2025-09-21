"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        const session = await authClient.getSession();
        if (!session?.data?.user) {
          router.replace("/");
          return;
        }
        setAuthenticated(true);
      } catch (error) {
        router.replace("/");
      }
    }
    checkSession();
  }, [router]);

  return <>{children}</>;
}
