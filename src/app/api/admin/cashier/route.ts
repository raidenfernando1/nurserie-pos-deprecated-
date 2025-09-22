import auth from "@/lib/auth-server";
import { db } from "@/lib/db-client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

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
          u."createdAt",
          u.banned
      FROM "user" u
      WHERE u.admin_id = ${userID}
        AND u.role = 'cashier';
      `;

    return NextResponse.json(response);
  } catch (e: any) {
    console.error(">>> Error in POST /api/admin/cashier");
    console.error(">>> Error object:", e);
    console.error(">>> Error stack:", e.stack);
    return NextResponse.json(
      { message: "Server error", error: e?.message ?? "Unknown" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  console.log(">>> Incoming request to /api/admin/cashier");

  try {
    const incomingHeaders = await headers();
    console.log(">>> Headers received:", Object.fromEntries(incomingHeaders));

    const session = await auth.api.getSession({ headers: incomingHeaders });
    console.log(">>> Session result:", session);

    if (!session) {
      console.warn(">>> Unauthorized: no session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      console.warn(">>> Unauthorized: user is not admin", session.user);
      return NextResponse.json(
        { error: "Unauthorized :) nice try mr hacker man" },
        { status: 403 },
      );
    }

    const userID = session.user.id;
    console.log(">>> Admin user ID:", userID);

    const body = await req.json();
    console.log(">>> Request body parsed:", body);

    const { username, password } = body;
    if (!username || !password) {
      console.warn(">>> Empty username or password");
      return NextResponse.json(
        { message: "Error: empty username or password" },
        { status: 400 },
      );
    }

    console.log(">>> Calling signUpEmail with:", {
      email: `${username}@placeholder.com`,
      password: "****", // don’t log raw password
      name: username,
      admin_id: userID,
    });

    const createCashier = await auth.api.signUpEmail({
      returnHeaders: true,
      body: {
        email: `${username}@placeholder.com`,
        password,
        name: username,
        admin_id: userID,
      },
    });

    console.log(">>> signUpEmail response:", createCashier);

    return NextResponse.json(
      {
        message: "Cashier created successfully",
        user: createCashier?.response?.user ?? null,
      },
      { status: 201 },
    );
  } catch (e: any) {
    console.error(">>> Error in POST /api/admin/cashier");
    console.error(">>> Error object:", e);
    console.error(">>> Error stack:", e.stack);
    return NextResponse.json(
      { message: "Server error", error: e?.message ?? "Unknown" },
      { status: 500 },
    );
  }
}
