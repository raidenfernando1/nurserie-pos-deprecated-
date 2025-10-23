"use server";

import auth from "@/lib/auth-server";
import { db } from "@/lib/db-client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createCustomerAction(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const phone_number = formData.get("phone_number")?.toString().trim() || null;

  if (!name || !email) {
    throw new Error("Name and email are required");
  }

  try {
    const result = await db`
      INSERT INTO customers (name, email, phone_number, created_by)
      VALUES (${name}, ${email}, ${phone_number}, ${session.user.id})
      RETURNING id, name, email, phone_number, created_by, created_at
    `;

    revalidatePath("/dashboard/customers"); // incorrect :0

    return {
      message: "Customer created successfully",
      data: result[0],
    };
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to create customer");
  }
}
