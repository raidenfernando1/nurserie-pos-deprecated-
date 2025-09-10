"use client";

import { authClient } from "@/lib/auth-client";
import { notFound } from "next/navigation";

export default function DashboardPage({
  params,
}: {
  params: { role: string };
}) {
  const DASHBOARD_VALID_ROLES = ["admin", "cashier"];

  if (!DASHBOARD_VALID_ROLES.includes(params.role)) {
    notFound();
  }

  async function testMake() {
    const res = await authClient.signUp.email({
      email: "test@placeholder.com",
      name: "test user",
      password: "supersecurepassword",
    });

    console.log(res);
  }

  return (
    <>
      <h1>{params.role} dashboard</h1>
      <button onClick={() => testMake()}>qweqw</button>
    </>
  );
}
