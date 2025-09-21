"use client";

import { DM_Sans } from "next/font/google";
import "./globals.css";
import { authClient } from "@/lib/auth-client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const MainFont = DM_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
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
  }, []);

  return (
    <html lang="en">
      <body className={`${MainFont.variable} ${MainFont.variable} `}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
