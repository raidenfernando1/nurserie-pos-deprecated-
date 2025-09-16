import auth from "@/lib/auth-server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("---- POST /api/admin/cashier called ----");

    const session = await auth.api.getSession({ headers: await headers() });
    console.log("Session:", session);

    if (!session) {
      console.warn("Unauthorized: no session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      console.warn("Unauthorized: user is not admin", session.user);
      return NextResponse.json(
        { error: "Unauthorized :) nice try mr hacker man" },
        { status: 403 }
      );
    }

    const userID = session.user.id;

    const body = await req.json();
    console.log("Request body:", body);

    const { username, password } = body;
    if (!username || !password) {
      console.warn("Empty username or password");
      return NextResponse.json(
        { message: "Error: empty username or password" },
        { status: 400 }
      );
    }

    console.log("Creating cashier for username:", username);
    const createCashier = await auth.api.signUpEmail({
      returnHeaders: true,
      body: {
        email: `${username}@placeholder.com`,
        password,
        name: username,
        admin_id: userID,
      },
    });

    console.log("createCashier result:", createCashier);

    return NextResponse.json(
      {
        message: "Cashier created successfully",
        user: createCashier.response.user,
      },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("Error in POST /api/admin/cashier:", e);
    return NextResponse.json(
      { message: "Server error", error: e.message },
      { status: 500 }
    );
  }
}
