import { NextResponse } from "next/server";
import auth from "@/lib/auth-server";
import { headers } from "next/headers";
import { db } from "@/lib/db-client";

export const GET = async (req: Request) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("search");

  if (!id || isNaN(Number(id))) {
    return NextResponse.json(
      { error: "Invalid or missing client ID." },
      { status: 400 }
    );
  }

  const clientInfo = await db`
    SELECT 
    id AS client_id,
    name AS client_name,
    code_name,
    serial_key
    FROM clients
    WHERE id = ${id};`;

  const response = await db`
    SELECT
    c.id AS consignment_id,
    c.client_id,
    c.consignment_name,
    c.warehouse_id,
    c.date_sent,
    c.status,
    c.date_not_active
    FROM consignments c
    JOIN clients cl
      ON c.client_id = cl.id
    WHERE cl.id = ${Number(id)}
    ORDER BY c.date_sent DESC;
  `;

  return NextResponse.json(
    {
      data: response,
      info: clientInfo,
    },
    { status: 200 }
  );
};
