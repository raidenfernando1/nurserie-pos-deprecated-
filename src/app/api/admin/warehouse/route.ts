import { NextResponse } from "next/server";
import auth from "@/lib/auth-server";
import { headers } from "next/headers";
import { db } from "@/lib/db-client";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const full = searchParams.get("full") === "true";

    const query = full
      ? db`
        SELECT
          w.id AS warehouse_id,
          w.warehouse_name,
          COALESCE(COUNT(wp.id), 0) AS total_products,
          COALESCE(SUM(wp.stock), 0) AS total_stock,
          COALESCE(SUM(CASE WHEN wp.stock > 0 THEN 1 ELSE 0 END), 0) AS products_in_stock,
          COALESCE(SUM(CASE WHEN wp.stock < wp.stock_threshold AND wp.stock > 0 THEN 1 ELSE 0 END), 0) AS low_stock_products,
          COALESCE(SUM(CASE WHEN wp.stock = 0 THEN 1 ELSE 0 END), 0) AS out_of_stock_products
        FROM warehouse w
        LEFT JOIN warehouse_products wp ON w.id = wp.warehouse_id
        GROUP BY w.id, w.warehouse_name
        ORDER BY w.warehouse_name;
      `
      : db`
        SELECT
          id AS warehouse_id,
          warehouse_name
        FROM warehouse
        ORDER BY id;
      `;

    const response = await query;

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error: any) {
    console.error("Error fetching warehouses:", error.message, error.stack);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { warehouse_name } = body;

    if (!warehouse_name || typeof warehouse_name !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing warehouse_name" },
        { status: 400 },
      );
    }

    const inserted = await db`
      INSERT INTO warehouse (warehouse_name)
      VALUES (${warehouse_name})
      RETURNING id, warehouse_name;
    `;

    return NextResponse.json({
      success: true,
      message: "Warehouse created successfully",
      warehouse: inserted[0],
    });
  } catch (error: any) {
    console.error("Error creating warehouse:", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to create warehouse", details: error.message },
      { status: 500 },
    );
  }
}
