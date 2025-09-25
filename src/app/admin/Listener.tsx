"use client";

import { authClient } from "@/lib/auth-client";
import useRole from "@/store/useRole";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const Listener = ({ children }: { children: React.ReactNode }) => {
  const { setRole } = useRole();
  const router = useRouter();
  const pathname = usePathname();

  const checkSession = async () => {
    try {
      const session = await authClient.getSession();
      const role = session.data?.user.role;

      if (!session) {
        router.replace("/error?msg=unauthorized");
        return;
      }

      if (role !== "admin") {
        router.replace("/error?msg=unauthorized");
        return;
      }

      setRole(role);
    } catch (error) {
      console.error("Error message: " + error);
      router.replace("/error?msg=unauthorized");
    }
  };

  useEffect(() => {
    checkSession();
  }, [pathname]);

  return <>{children}</>;
};

export default Listener;
