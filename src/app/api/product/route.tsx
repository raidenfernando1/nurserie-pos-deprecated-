import { NextResponse } from "next/server";
import auth from "@/lib/auth-server";
import { headers } from "next/headers";
import { db } from "@/lib/db-client";

export const DELETE = async (req: Request) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userID = session.user.id;
  const role = session.user.role;
  if (role !== "admin") {
    return NextResponse.json(
      { error: "Unauthorized wrong role!" },
      { status: 401 },
    );
  }
  const body = await req.json();
  const { sku, isGlobal, warehouseId } = body;
  if (!sku) {
    return NextResponse.json(
      { error: "sku unexpected error" },
      { status: 400 },
    );
  }

  if (!isGlobal && !warehouseId) {
    return NextResponse.json(
      { error: "warehouseId required for warehouse-specific delete" },
      { status: 400 },
    );
  }

  try {
    const product = await db`
      SELECT p.id
      FROM products p
      WHERE p.sku = ${sku}
    `;
    if (product.length === 0) {
      return NextResponse.json(
        { error: "No product found or not authorized to delete" },
        { status: 404 },
      );
    }

    const productId = product[0].id;

    if (isGlobal) {
      await db`
        DELETE FROM products
        WHERE sku = ${sku}
      `;
      return NextResponse.json(
        { message: "Product deleted globally" },
        { status: 200 },
      );
    } else {
      await db`
        DELETE FROM warehouse_products
        WHERE product_id = ${productId}
        AND warehouse_id = ${warehouseId}
        AND EXISTS (
          SELECT 1 FROM warehouse w
          WHERE w.id = ${warehouseId}
        )
      `;

      return NextResponse.json(
        { message: "Product removed from warehouse" },
        { status: 200 },
      );
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "unknown error" }, { status: 500 });
  }
};
