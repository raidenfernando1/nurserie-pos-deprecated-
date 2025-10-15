"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Roles } from "@/types/user";
import { useLoginStore } from "@/store/login-store";

interface ProtectedRouteProps {
  intendedRole: Roles;
  children: React.ReactNode;
}

const ProtectedRoute = ({ intendedRole, children }: ProtectedRouteProps) => {
  const router = useRouter();
  const { fetchSession } = useLoginStore();

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      try {
        const session = await fetchSession();
        const role = session?.data?.user?.role as Roles | undefined;

        if (!session?.data || !role || role !== intendedRole) {
          if (active) router.replace("/error?msg=unauthorized");
          return;
        }

        console.info(`Authorized as ${role}`);
      } catch (error) {
        console.error("Error checking session:", error);
        if (active) router.replace("/error?msg=unauthorized");
      }
    };

    checkSession();

    return () => {
      active = false;
    };
  }, [fetchSession, router, intendedRole]);

  return <>{children}</>;
};

export default ProtectedRoute;
