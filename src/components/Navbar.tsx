"use client";

import React from "react";

export default function Navbar() {
  const [loading, setLoading] = React.useState(false);

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 border-b-2">
      <h1 className="font-bold text-lg">Nurserie Dashboard</h1>
      <ul className="flex gap-10 list-none"></ul>
      <div className="flex items-center gap-6">
        <p className="flex items-center">Welcome, test</p>
        <button
          disabled={loading}
          className={`font-semibold cursor-pointer border-2 px-4 py-2 rounded ${
            loading
              ? "bg-red-500 border-red-700 text-red-900 cursor-not-allowed"
              : "bg-red-500 border-red-700 text-red-900"
          }`}
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </nav>
  );
}
