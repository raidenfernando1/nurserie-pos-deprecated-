"use client";

import React from "react";
import useError from "@/store/useError";
import LoginForm from "@/components/LoginPage";
import { useAdminAuth } from "@/lib/admin/login";

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
    <main className="min-h-screen w-full flex flex-col bg-[#f9f6f3]">
      <div className="hidden md:flex flex-row gap-2 sm:gap-4 justify-end px-4 sm:px-10 py-4">
        <button
          className="border rounded px-4 py-2 w-full sm:w-auto cursor-pointer 
             hover:bg-blue-500 hover:text-white transition duration-200"
          onClick={() => setSelectedRole("cashier")}
        >
          Cashier
        </button>

        <button
          className="border rounded px-4 py-2 w-full sm:w-auto cursor-pointer 
             hover:bg-red-500 hover:text-white transition duration-200"
          onClick={() => useAdminAuth().Login()}
        >
          Admin
        </button>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center text-center md:items-start md:justify-start md:text-left px-4 sm:px-10 lg:px-20 py-10">
        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold">
          NURSERIE 👶🏿
        </h1>
        <p className="max-w-md py-5 text-lg sm:text-2xl lg:text-4xl mt-2">
          We are Nurserie
        </p>

        <div className=" space-y-2 text-sm sm:text-base lg:text-lg">
          <p>
            We are a young, family-owned, parent-operated company at the heart
            of Metro Manila.
          </p>
          <p>
            We started looking for the best of the best products for our girls,
            and we hope that, through us, you find thoughtful, functional,
            well-made products for your little ones.
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
