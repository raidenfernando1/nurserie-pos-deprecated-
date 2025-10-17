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
    console.warn("🚫 Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const { warehouseID, sku, stock, stock_threshold } = body;

    if (!warehouseID || !sku || stock == null || stock_threshold == null) {
      console.warn("⚠️ Missing required fields:", {
        warehouseID,
        sku,
        stock,
        stock_threshold,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const productResult = await db`
      SELECT id FROM products WHERE sku = ${sku}
    `;

    if (productResult.length === 0) {
      console.warn(`❌ Product with SKU '${sku}' not found`);
      return NextResponse.json(
        { error: "Product with SKU not found" },
        { status: 404 },
      );
    }

    const product_id = productResult[0].id;

    const warehouseProductResult = await db`
      INSERT INTO warehouse_products (warehouse_id, product_id, stock, stock_threshold)
      VALUES (${warehouseID}, ${product_id}, ${stock}, ${stock_threshold})
      ON CONFLICT (warehouse_id, product_id)
      DO UPDATE SET
        stock = warehouse_products.stock + ${stock},
        stock_threshold = ${stock_threshold}
      RETURNING *
    `;
    return NextResponse.json({
      success: true,
      data: warehouseProductResult[0],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
