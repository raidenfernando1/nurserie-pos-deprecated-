"use server";

import auth from "@/lib/auth-server";
import { db } from "@/lib/db-client";
import { headers } from "next/headers";
import type { Customers } from "@/types/customers";

export async function getCustomers(): Promise<Customers[]> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const customers = (await db`
      SELECT
        c.id,
        c.name,
        c.email,
        c.phone_number,
        c.loyalty_number,
        c.created_by,
        u.name AS created_by_name,
        u.role AS created_by_role,
        c.created_at
      FROM customers c
      LEFT JOIN "user" u ON c.created_by = u.id
      ORDER BY c.created_at DESC;
    `) as Customers[];

    return customers;
  } catch (error) {
    console.error("getCustomers error:", error);
    throw new Error("Failed to fetch customers");
  }
}
