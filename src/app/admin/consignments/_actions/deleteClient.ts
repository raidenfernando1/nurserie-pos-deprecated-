"use server";

import { db } from "@/lib/db-client";
import { headers } from "next/headers";
import auth from "@/lib/auth-server";

export async function deleteClient(serial_key: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  if (!serial_key?.trim()) {
    throw new Error("serial_key is required");
  }

  try {
    const result = await db`
      DELETE FROM clients
      WHERE serial_key = ${serial_key.trim()}
      RETURNING *;
    `;

    if (result.length === 0) {
      throw new Error("Client not found");
    }

    return result[0];
  } catch (e) {
    console.error("deleteClient error:", e);
    throw new Error("Failed to delete client");
  }
}
