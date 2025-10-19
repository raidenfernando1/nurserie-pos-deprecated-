import auth from "@/lib/auth-server";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db-client";
import { baseUrl } from "@/components/data";

const adminUserIds = ["RKvdVdU77zQF230CKUAY8gr2ujYEVWKq"];

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !session.user) {
    return NextResponse.redirect(`${baseUrl}/admin/login`);
  }

  if (!adminUserIds.includes(session.user.id)) {
    try {
      await db.query(`DELETE FROM "user" WHERE id = $1`, [session.user.id]);
    } catch (err) {
      console.error("Failed to delete unauthorized user:", err);
    }

    await auth.api.signOut({ headers: await headers() });
    return NextResponse.redirect(`${baseUrl}/admin/unauthorized`);
  }

  return NextResponse.redirect(`${baseUrl}/admin/dashboard`);
}
