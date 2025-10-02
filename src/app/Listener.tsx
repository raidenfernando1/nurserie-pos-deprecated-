"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const Listener = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const checkRoleAndRedirect = async () => {
      try {
        const session = await authClient.getSession();
        const role = session?.data?.user?.role;

        if (!session) return;

        if (role === "admin") {
          router.replace("/admin/dashboard");
        } else if (role === "cashier") {
          router.replace("/cashier");
        }
      } catch (err) {
        console.error("Error checking session:", err);
      }
    };

    checkRoleAndRedirect();
  }, [pathname, router]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default Listener;
