"use client";

import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useAdminAuth } from "@/lib/admin/login";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import LoginForm from "@/components/LoginPage";
import { Separator } from "@/components/ui/separator";

export default function Entry() {
  const [showCashierLogin, setShowCashierLogin] = React.useState(false);
  const adminAuth = useAdminAuth();

  const PathItems = [
    { name: "Support", path: "/support" },
    { name: "About", path: "/about" },
    { name: "Developers", path: "/developers" },
  ];

  const {
    data: health,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["DatabaseHealth"],
    queryFn: async () => {
      const response = await fetch("/api/health");
      if (!response.ok) throw new Error("Health check failed");
      return (await response.json()).health;
    },
    refetchInterval: 60_000,
  });

  return (
    <>
      <Head>
        <title>Oracle POS</title>
        <meta
          name="description"
          content="All-in-one POS system for Oracle Petroleum Corporation"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Oracle POS" />
        <meta
          property="og:description"
          content="All-in-one POS system for Oracle Petroleum Corporation"
        />
        <meta property="og:type" content="website" />
      </Head>

      <main className="h-screen w-full flex flex-col">
        {/* Top nav */}
        <div className="hidden md:flex flex-row gap-2 sm:gap-4 justify-between px-4 sm:px-10 py-4">
          <div className="flex items-center gap-6">
            {PathItems.map((item) => (
              <React.Fragment key={item.path}>
                <Separator orientation="vertical" />
                <Button
                  variant="link"
                  className="text-lg cursor-pointer"
                  asChild
                >
                  <Link href={item.path}>{item.name}</Link>
                </Button>
              </React.Fragment>
            ))}
          </div>
          <div className="flex gap-6">
            <Button
              className="cursor-pointer"
              onClick={() => setShowCashierLogin(true)}
            >
              User
            </Button>
            <Button
              className="cursor-pointer"
              onClick={() => adminAuth.Login()}
            >
              Admin
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="h-full flex flex-col justify-between p-12">
          {showCashierLogin ? (
            <div className="w-full h-full flex items-center justify-center">
              <LoginForm title="Oracle POS" subTitle="cashier" role="cashier" />
            </div>
          ) : (
            <>
              <div className="h-3/4 flex flex-col justify-center gap-12">
                <div>
                  <h1 className="text-9xl font-extrabold">Oracle POS</h1>
                  <p className="text-gray-500">
                    Property of Oracle Petroleum Corporation
                  </p>
                </div>
                <div className="w-3/4 text-lg">
                  <p>
                    We are a young, family-owned, parent-operated company at the
                    heart of Metro Manila...
                  </p>
                </div>
              </div>
              <div>
                {isLoading ? (
                  <p className="text-lg">Checking database status...</p>
                ) : error ? (
                  <p className="text-lg text-red-600">
                    Error checking database
                  </p>
                ) : (
                  <p className="text-lg">
                    Database Status:
                    {health ? (
                      <span className="text-green-700"> Operational</span>
                    ) : (
                      <span className="text-red-700"> Non-Operational</span>
                    )}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
