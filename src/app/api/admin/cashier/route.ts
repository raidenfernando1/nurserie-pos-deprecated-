import { NextResponse } from "next/server";
import { db } from "@/lib/db-client";
import { headers } from "next/headers";
import auth from "@/lib/auth-server";

// GET all cashiers under current admin
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userID = session.user.id;

    const response = await db`
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

    return NextResponse.json(response);
  } catch (e: any) {
    console.error(">>> Error in GET /api/admin/cashier", e);
    return NextResponse.json(
      { message: "Server error", error: e?.message ?? "Unknown" },
      { status: 500 },
    );
  }
}
