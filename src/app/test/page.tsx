"use client";
import { authClient } from "@/lib/auth-client";
import React from "react";

export default function Test() {
  const [testState, setTestState] = React.useState("");

  const createAcccount = async () => {
    console.log("inferred");

    try {
      const res = await fetch("/auth/api/check", {
        method: "GET",
      });

      console.log(res);
      return res;
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      {testState}
      <button onClick={() => createAcccount()}>test</button>
    </div>
  );
}
