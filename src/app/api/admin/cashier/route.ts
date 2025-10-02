import { NextResponse } from "next/server";
import { db } from "@/lib/db-client";
import { headers } from "next/headers";
import auth from "@/lib/auth-server";
import { hashPassword } from "@/lib/auth-server";

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

// POST: create cashier OR change cashier password
export async function POST(req: Request) {
  const incomingHeaders = await headers();
  const session = await auth.api.getSession({ headers: incomingHeaders });

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminID = session.user.id;
  const body = await req.json();

  if (body.type === "changePassword") {
    const { cashierID, newPassword } = body;
    if (!cashierID || !newPassword) {
      return NextResponse.json(
        { error: "Missing cashierID or newPassword" },
        { status: 400 },
      );
    }

    try {
      const hashedPassword = await hashPassword(newPassword);

      const result = await db`
        UPDATE account a
        SET password = ${hashedPassword},
            "updatedAt" = NOW()
        FROM "user" u
        WHERE a."userId" = u."id"
          AND u.admin_id = ${adminID}
          AND u.id = ${cashierID}
        RETURNING a."accountId", a."updatedAt";
      `;

      if (result.length === 0) {
        return NextResponse.json(
          { error: "No matching cashier account found" },
          { status: 404 },
        );
      }

      return NextResponse.json({
        message: "Password updated successfully",
        updated: result[0],
      });
    } catch (err) {
      console.error(">>> Error changing password:", err);
      return NextResponse.json(
        { error: "Password update failed" },
        { status: 500 },
      );
    }
  }

  // Fallback: create a new cashier
  const { username, password, name } = body;
  if (!username || !password || !name) {
    return NextResponse.json(
      { message: "Error: empty username, password or name" },
      { status: 400 },
    );
  }

  try {
    const createCashier = await auth.api.signUpEmail({
      returnHeaders: true,
      body: {
        email: `${username}@placeholder.com`,
        password,
        name: name,
        username: username,
        admin_id: adminID,
      },
    });

    return NextResponse.json(
      {
        message: "Cashier created successfully",
        user: createCashier?.response?.user ?? null,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Error creating cashier:", err);
    return NextResponse.json(
      { message: "Cashier creation failed" },
      { status: 500 },
    );
  }
}
