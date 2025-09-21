import auth from "@/lib/auth-server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db-client";
import { headers } from "next/headers";

// api to fetch all admins based on theyre admin
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userID = session.user.id;

  try {
    const cashiers = await db`
  SELECT 
    a.id AS admin_id,
    a.name AS admin_name,
    c.id AS cashier_id,
    c.name AS cashier_name,
    c."createdAt" AS cashier_created_at
  FROM "user" a
  LEFT JOIN "user" c ON c.admin_id = a.id
  WHERE a.role = 'admin'
    AND a.id = ${userID};
`;

    if (cashiers.length === 0) {
      return NextResponse.json(
        { message: "No warehouses found for this admin" },
        { status: 404 }
      );
    }

    return NextResponse.json(cashiers, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching cashiers:", error.message, error.stack);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
