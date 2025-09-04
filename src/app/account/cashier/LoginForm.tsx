"use client";

import React from "react";

export default function CashierLogin() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  function handleSubmit(event: React.FormEvent) {
    alert("test");
  }

  return (
    <form
      className="full flex flex-col items-center justify-center"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-4 justify-center">
        <input
          className="p-3 text-xl border-2 rounded"
          placeholder="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="p-3 text-xl border-2 rounded"
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="p-2 border-2 bg-green-400 color text-black border-green-600 cursor-pointer duration-200 hover:opacity-80                                                                                                           "
          type="submit"
        >
          SUBMIT
        </button>
      </div>
    </form>
  );
}
