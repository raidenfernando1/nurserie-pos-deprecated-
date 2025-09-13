"use client";

import React from "react";
import useError from "@/store/useError";
import LoginForm from "@/components/LoginPage";

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
      case "staff":
        return <LoginForm title="nurserie" subTitle="staff" role="staff" />;
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
    <main className="w-full h-full">
      <div className="w-full h-1/6 fixed flex items-center justify-center text-7xl">
        <h1>nurserie</h1>
      </div>
      <div className="w-full h-full flex justify-evenly items-center">
        {cardList.map(({ name, role }, index) => (
          <SquareCard
            key={index}
            name={name}
            role={role}
            onSelect={setSelectedRole}
          />
        ))}
      </div>
      <div className="absolute bottom-4 w-full text-center">
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
