import auth from "@/lib/auth-server";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db-client";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !session.user) {
    return NextResponse.redirect("http://localhost:3000/");
  }

  const userID = session.user.id;

  if (session.user.email !== "fernandoraiden6@gmail.com") {
    try {
      await db.query(`DELETE FROM "user" WHERE id = $1`, [userID]);
    } catch (err) {
      console.error("Failed to delete user:", err);
      return NextResponse.json(
        { error: "Failed to delete user" },
        { status: 500 }
      );
    }

    return NextResponse.redirect("http://localhost:3000/404");
  }

  return NextResponse.redirect("http://localhost:3000/admin/dashboard");
}

export async function POST(req: Request) {
  const body = await req.json();
  const { email } = body;

  if (email !== "fernandoraiden6@gmail.com") {
    return NextResponse.json(
      {
        message: "Authorized",
        authorized: true,
      },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      {
        message: "Unauthorized",
        authorized: false,
      },
      { status: 400 }
    );
  }
}
