"use client";

import { GalleryVerticalEnd } from "lucide-react";
import React from "react";
import Head from "next/head";
import { useLoginStore } from "@/store/login-store";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import LoginForm from "@/components/login-form";
import { Navbar } from "@/components/navbar";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function Entry() {
  const [showCashierLogin, setShowCashierLogin] = useState(false);
  const { loginAdmin, fetchSession } = useLoginStore();
  const { theme, setTheme } = useTheme();

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

      <main className="h-screen max-h-screen w-full flex flex-col overflow-hidden">
        {!showCashierLogin && (
          <div className="flex-shrink-0 md:flex flex-row gap-2 sm:gap-4 justify-between px-4 sm:px-10 py-4">
            <div className="flex items-center gap-6">
              <Navbar />
            </div>
            <div className="gap-6 hidden md:flex">
              <Button
                className="cursor-pointer"
                onClick={() => setShowCashierLogin(true)}
              >
                Cashier
              </Button>
              <Button className="cursor-pointer" onClick={() => loginAdmin()}>
                Admin
              </Button>
              <Button
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun /> : <Moon />}
              </Button>
            </div>
          </div>
        )}

        {showCashierLogin ? (
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
              <a
                href="#"
                className="flex items-center gap-2 self-center font-medium"
              >
                <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                Oracle Petroleum Corporation
              </a>
              <LoginForm />
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col justify-between p-6 sm:p-12 overflow-y-auto">
            <div className="flex-1 flex flex-col justify-center">
              <h1 className="scroll-m-20 text-3xl sm:text-4xl md:text-5xl lg:text-9xl font-bold">
                Oracle POS
              </h1>
              <p className="text-sm sm:text-xs md:text-sm text-muted-foreground">
                Property of Oracle Petroleum Corporation
              </p>
              <p className="md:w-3/4 text-sm sm:text-base md:text-lg leading-relaxed mt-5">
                Our multi-tenant POS system — developed by a dedicated team of
                interns at Oracle Petroleum Corporation — enables multiple
                companies to operate on a single platform with secure,
                independent data, customizable settings, and real-time
                reporting, delivering a flexible solution for businesses across
                various industries.
              </p>
            </div>
            <div className="flex-shrink-0 mt-4">
              {isLoading ? (
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  Checking database status...
                </p>
              ) : error ? (
                <p className="leading-7 [&:not(:first-child)]:mt-6 text-red-700">
                  Error checking database
                </p>
              ) : (
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  Database Status:
                  {health ? (
                    <span className="text-green-700"> Operational</span>
                  ) : (
                    <span className="text-red-700"> Non-Operational</span>
                  )}
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
