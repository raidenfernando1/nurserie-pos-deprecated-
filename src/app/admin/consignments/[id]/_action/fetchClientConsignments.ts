"use server";

import { db } from "@/lib/db-client";
import auth from "@/lib/auth-server";
import { headers } from "next/headers";

export default async function fetchClientConsignments(clientId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    if (!clientId || isNaN(Number(clientId))) {
      return { success: false, error: "Invalid or missing client ID." };
    }

    const clientInfo = await db`
      SELECT
        id AS client_id,
        name AS client_name,
        code_name,
        serial_key
      FROM clients
      WHERE id = ${clientId};
    `;

    const consignments = await db`
      SELECT c.*
      FROM consignments c
      JOIN clients cl
        ON c.client_id = cl.id
      WHERE cl.id = ${Number(clientId)}
      ORDER BY c.date_sent DESC;
    `;

    return {
      success: true,
      data: consignments,
      info: clientInfo.length > 0 ? clientInfo[0] : null,
    };
  } catch (error) {
    console.error("Error fetching client consignments:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
