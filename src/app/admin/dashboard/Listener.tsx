"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Listener = ({ children }: { children: React.ReactNode }) => {
  const checkSession = async () => {
    const session = await authClient.getSession();
    const email = session?.data?.user.email;
    const role = session?.data?.user.role;
    const router = useRouter();

    if (!session || !email) {
      await authClient.signOut();
      router.push("/");
    }

    if (role !== "admin") {
      await authClient.signOut();
      router.push("/");
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return <>{children}</>;
};

export default Listener;
