import { NextResponse } from "next/server";
import { db } from "@/lib/db-client";
import { headers } from "next/headers";
import auth from "@/lib/auth-server";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userID = session.user.id;
    const body = await req.json();
    const { cashierID, newPassword } = body;

    if (!cashierID || !newPassword) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await db`
      UPDATE account a
      SET password = ${newPassword},
          "updatedAt" = NOW()
      FROM "user" u
      WHERE a."userId" = u."id"
        AND u."admin_id" = ${cashierID}
        AND a."accountId" = ${userID}
      RETURNING a."accountId", a."updatedAt";
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "No matching account found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      updated: result[0],
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
