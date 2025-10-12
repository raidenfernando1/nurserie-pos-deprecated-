import { NextResponse } from "next/server";
import auth from "@/lib/auth-server";
import { db } from "@/lib/db-client";
import { headers } from "next/headers";

export const GET = async (req: Request) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const products = await db`
      SELECT wp.id, wp.warehouse_id, wp.product_id, wp.stock, wp.stock_threshold, w.warehouse_name, p.name AS product_name ,p.category, p.sku, p.barcode, p.category, p.price, p.image_url
      FROM warehouse_products wp
      JOIN warehouse w ON wp.warehouse_id = w.id
      JOIN products p ON wp.product_id = p.id
`;

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

export const POST = async (req: Request) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { warehouse_id, sku, stock, stock_threshold } = body;

    if (!warehouse_id || !sku || stock == null || stock_threshold == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await db`
      INSERT INTO warehouse_products (warehouse_id, product_id, stock, stock_threshold)
      SELECT
        ${warehouse_id},
        id,
        ${stock},
        ${stock_threshold}
      FROM products
      WHERE sku = ${sku}
      ON CONFLICT (warehouse_id, product_id) DO UPDATE
      SET stock = EXCLUDED.stock,
          stock_threshold = EXCLUDED.stock_threshold
      RETURNING *;
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Product SKU not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
