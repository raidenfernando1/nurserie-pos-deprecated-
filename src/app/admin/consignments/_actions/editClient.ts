"use server";

import { db } from "@/lib/db-client";
import { headers } from "next/headers";
import auth from "@/lib/auth-server";

export async function updateClient(payload: {
  serial_key: string;
  name?: string;
  code_name?: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const { serial_key, name, code_name } = payload;

  if (!serial_key?.trim()) {
    throw new Error("serial_key is required");
  }

  const hasName = name && name.trim();
  const hasCodeName = code_name && code_name.trim();

  if (!hasName && !hasCodeName) {
    throw new Error("At least one field (name or code_name) must be provided");
  }

  try {
    const result = await db`
      UPDATE clients
      SET
        name = COALESCE(${hasName ? name.trim() : null}, name),
        code_name = COALESCE(${hasCodeName ? code_name.trim() : null}, code_name)
      WHERE serial_key = ${serial_key.trim()}
      RETURNING *;
    `;

    if (result.length === 0) {
      throw new Error("Client not found");
    }

    return result[0];
  } catch (e) {
    console.error("updateClient error:", e);
    throw new Error("Failed to update client");
  }
}
