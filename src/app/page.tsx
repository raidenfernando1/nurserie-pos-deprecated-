"use client";

import { GalleryVerticalEnd } from "lucide-react";
import React from "react";
import Head from "next/head";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import LoginForm from "@/components/login-form";
import { Navbar } from "@/components/navbar";
import { useState } from "react";
import { company } from "@/components/data";
import { useRouter } from "next/navigation";
import { useLoginStore } from "@/store/login-store";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Entry() {
  const { loginAdmin, fetchSession } = useLoginStore();
  const router = useRouter();

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
        <div className="flex-shrink-0 md:flex flex-row gap-2 sm:gap-4 justify-between px-4 sm:px-10 py-4">
          <div className="flex items-center gap-6">
            <Navbar />
          </div>
          <div className="gap-6 hidden md:flex">
            <ThemeToggle />
            <Button
              className="cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col justify-between p-6 sm:p-12 overflow-y-auto">
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="scroll-m-20 text-3xl sm:text-4xl md:text-5xl lg:text-9xl font-bold">
              {company.name}
            </h1>
            <p className="text-sm sm:text-xs md:text-sm text-muted-foreground">
              Property of Oracle Petroleum Corporation
            </p>
            <p className="md:w-3/4 text-sm sm:text-base md:text-lg leading-relaxed mt-5">
              To provide and curate brands and products that cater to the
              premium lifestyle of modern families. A modern family lifestyle
              team that curates the best products for babies, kids and families
              in terms of lifestyle, sustainability and functionality.
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
      </main>
    </>
  );
}
