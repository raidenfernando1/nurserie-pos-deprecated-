import auth from "@/lib/auth-server";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db-client";

const adminUserIds = [
  "DQ6QE041xsIVa8g7GPXeTTgZkp81l6cH",
  "d5zYyaanwqcdcfZGU3cCVC4jB0t0zMxb",
];

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !session.user) {
    return NextResponse.redirect("http://localhost:3000/admin/login");
  }

  if (!adminUserIds.includes(session.user.id)) {
    try {
      await db.query(`DELETE FROM "user" WHERE id = $1`, [session.user.id]);
    } catch (err) {
      console.error("Failed to delete unauthorized user:", err);
    }

    // Sign out
    await auth.api.signOut({ headers: await headers() });
    return NextResponse.redirect("http://localhost:3000/admin/unauthorized");
  }

  return NextResponse.redirect("http://localhost:3000/admin/dashboard");
}
