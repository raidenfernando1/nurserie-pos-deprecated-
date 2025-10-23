"use server";

import auth from "@/lib/auth-server";
import { headers } from "next/headers";
import { db } from "@/lib/db-client";

export async function getCashiers() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const userID = session.user.id;

    const cashiers = await db`
      SELECT
          u.id,
          u.name,
          u.username,
          u."createdAt",
          u.banned
      FROM "user" u
      WHERE u.admin_id = ${userID}
        AND u.role = 'cashier';
    `;

    return { success: true, data: cashiers };
  } catch (error) {
    console.error(">>> Error in getCashiers", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch cashiers",
    );
  }
}
