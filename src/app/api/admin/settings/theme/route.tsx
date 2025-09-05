import auth from "@/lib/auth-server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db-client";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Check if user is admin
    if (session?.user?.email !== "fernandoraiden6@gmail.com") {
      return NextResponse.json(
        { message: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const themes = await db`SELECT * FROM themes;`;

    return NextResponse.json({
      themes,
      count: themes.length,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { message: `Database error: ${error}` },
      { status: 500 } // Proper server error status
    );
  }
}
