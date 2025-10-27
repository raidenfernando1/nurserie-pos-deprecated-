"use server";

import { db } from "@/lib/db-client";
import { headers } from "next/headers";
import auth from "@/lib/auth-server";

export default async function fetchClients(search?: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  try {
    const query = search
      ? db`
        SELECT
          id AS client_id,
          name AS client_name,
          code_name,
          date_added,
          serial_key
        FROM clients
        WHERE serial_key = ${search};
      `
      : db`
        SELECT
          id AS client_id,
          name AS client_name,
          code_name,
          date_added,
          serial_key
        FROM clients
        ORDER BY date_added DESC;
      `;

    const result = await query;
    console.log(result);
    return result;
  } catch (e) {
    console.error("getClients error:", e);
    throw new Error("Failed to fetch clients");
  }
}
