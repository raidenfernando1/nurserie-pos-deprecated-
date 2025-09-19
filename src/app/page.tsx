"use client";

import React from "react";
import useError from "@/store/useError";
import LoginForm from "@/components/LoginPage";
import { useAdminAuth } from "@/lib/admin/login";
import { Button } from "@/components/ui/button";

const cardList = [
  { name: "cashier", role: "cashier" },
  { name: "admin", role: "admin" },
];

function SquareCard({
  name,
  role,
  onSelect,
}: {
  name: string;
  role: string;
  onSelect: (role: string) => void;
}) {
  function handleClick() {
    onSelect(role);
  }

  return (
    <button
      onClick={handleClick}
      className="cursor-pointer size-80 border-2 rounded-2xl flex items-center justify-center text-2xl"
    >
      {name}
    </button>
  );
}

export default function Entry() {
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);
  const { healthDB, setHealthDB } = useError();

  React.useEffect(() => {
    async function fetchHealth() {
      try {
        const res = await fetch("/api/health");
        const data = await res.json();
        setHealthDB(data.healthDB);
      } catch (e) {
        console.error(e);
        setHealthDB(false);
      }
    }
    fetchHealth();
  }, [setHealthDB]);

  function renderContent(selectedRole: string) {
    switch (selectedRole) {
      case "admin":
        return (
          <LoginForm title="nurserie" subTitle="administrator" role="admin" />
        );
      case "cashier":
        return <LoginForm title="nurserie" subTitle="cashier" role="cashier" />;
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
    <main className="min-h-screen w-full flex flex-col bg-black">
      <div className="hidden md:flex flex-row gap-2 sm:gap-4 justify-end px-4 sm:px-10 py-4">
        <div className="flex flex-wrap items-center gap-2 md:flex-row rounded">
          <Button
            className="rounded hover:bg-blue-500 hover:text-white transition duration-200"
            onClick={() => setSelectedRole("cashier")}
          >
            Cashier
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button
            className="rounded hover:bg-red-500 hover:text-white transition duration-200"
            onClick={() => useAdminAuth().Login()}
          >
            Admin
          </Button>
        </div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center text-center md:items-start md:justify-start md:text-left px-4 sm:px-10 lg:px-20 py-10">
        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold">POS</h1>

        <div className=" space-y-2 text-sm sm:text-base lg:text-lg py-10">
          <p>
            We are a young, family-owned, parent-operated company at the heart
            of Metro Manila.
          </p>
          <p>
            This all-in-one POS handles everything from tracking transactions to
            managing inventory, so you can focus on what matters. The best part?
            You can customize the look to match your brand. It's powerful, and
            it's personal
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-10 py-4 text-sm sm:text-base">
        <p className="text-lg">
          Database Status:{" "}
          <span
            className={
              healthDB
                ? "text-green-500"
                : healthDB === false
                ? "text-red-500"
                : ""
            }
          >
            {healthDB === undefined
              ? "Checking..."
              : healthDB
              ? "Online"
              : "Offline"}
          </span>
        </p>
      </div>
    </main>
  );
}
