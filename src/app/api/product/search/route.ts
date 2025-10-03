import { NextResponse } from "next/server";
import auth from "@/lib/auth-server";
import { db } from "@/lib/db-client";
import { headers } from "next/headers";

export const POST = async (req: Request) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { sku } = body;

  if (!sku) {
    return NextResponse.json(
      { error: "Missing SKU in request body" },
      { status: 400 },
    );
  }

  try {
    const response = await db`
      SELECT p.*
      FROM products p
      WHERE p.sku = ${sku}
    `;

    if (response.length === 0) {
      return NextResponse.json(
        { error: "No product with this SKU found" },
        { status: 404 },
      );
    }

    return NextResponse.json(response, { status: 200 });
  } catch (e) {
    console.error("POST /api/product/search error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: Request) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userID = session.user.id;
  const body = await req.json();
  const { sku } = body;

  if (!sku) {
    return NextResponse.json(
      { error: "sku unexpected error" },
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
      return NextResponse.json({ error: "No product found" }, { status: 404 });
    }

    // Delete directly
    await db`
      DELETE FROM products
      WHERE sku = ${sku}
    `;

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "unknown error" }, { status: 500 });
  }
};
