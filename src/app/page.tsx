"use client";

import React from "react";
import useError from "@/store/useError";

const cardList = [
  { name: "cashier", path: "/account/cashier" },
  { name: "staff", path: "/account/staff" },
];

function SquareCard({ name, path }: { name: string; path: string }) {
  return (
    <a
      className="size-80 border-2 rounded-2xl flex items-center justify-center text-2xl"
      href={path}
    >
      {name}
    </a>
  );
}

export default function Entry() {
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

  return (
    <main className="w-full h-full">
      <div className="w-full h-1/6 fixed flex items-center justify-center text-7xl">
        <h1>nurserie</h1>
      </div>
      <div className="w-full h-full flex justify-evenly items-center">
        {cardList.map(({ name, path }, index) => (
          <SquareCard key={index} name={name} path={path} />
        ))}
      </div>
      <div className="absolute bottom-4 w-full text-center">
        <p className="text-lg">
          DB Status:{" "}
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
              ? "Healthy"
              : "Down!"}
          </span>
        </p>
      </div>
    </main>
  );
}
