"use client";

import React from "react";
import Link from "next/link";
import { useAdminAuth } from "@/lib/admin/login";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import LoginForm from "@/components/LoginPage";
import { Check, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Entry() {
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);
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
      const result = await response.json();
      return result.health;
    },
    refetchInterval: 60_000,
  });

  function renderContent(selectedRole: string) {
    switch (selectedRole) {
      case "cashier":
        return (
          <LoginForm title="Oracle POS" subTitle="cashier" role="cashier" />
        );
      default:
        return null;
    }
  }

  if (selectedRole) {
    return (
      <main className="w-full h-full flex items-center justify-center">
        {renderContent(selectedRole)}
      </main>
    );
  }

  return (
    <main className="h-screen w-full flex flex-col">
      <div className="hidden md:flex flex-row gap-2 sm:gap-4 justify-between px-4 sm:px-10 py-4">
        <div className="flex items-center gap-6">
          {PathItems.map((item) => (
            <>
              <Separator orientation="vertical" />
              <Button
                key={item.path}
                variant="link"
                className="text-lg cursor-pointer"
                asChild
              >
                <Link href={item.path}>{item.name}</Link>
              </Button>
            </>
          ))}
        </div>
        <div className="flex gap-6">
          <Button
            className="cursor-pointer"
            onClick={() => setSelectedRole("cashier")}
          >
            User
          </Button>
          <Button className="cursor-pointer" onClick={() => adminAuth.Login()}>
            Admin
          </Button>
        </div>
      </div>

      <div className="h-full flex flex-col justify-between p-12">
        <div className="h-3/4 flex flex-col justify-center gap-12">
          <div>
            <h1 className="text-9xl font-extrabold">Oracle POS</h1>
            <p className="text-gray-500">
              Property of Oracle Petroleum Corporation
            </p>
          </div>
          <div className="w-3/4 text-lg">
            <p>
              We are a young, family-owned, parent-operated company at the heart
              of Metro Manila. This all-in-one POS handles everything from
              tracking transactions to managing inventory, so you can focus on
              what matters. The best part? You can customize the look to match
              your brand.
            </p>
          </div>
        </div>

        <div>
          {isLoading ? (
            <p className="text-lg">Checking database status...</p>
          ) : error ? (
            <p className="text-lg text-red-600">Error checking database</p>
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
      </div>
    </main>
  );
}
