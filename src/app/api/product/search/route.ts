import { NextResponse } from "next/server";
import auth from "@/lib/auth-server";
import { db } from "@/lib/db-client";
import { headers } from "next/headers";

export const POST = async (req: Request) => {
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
      { status: 500 },
    );
  }

  try {
    const response = await db`
      SELECT p.*, c.company_name
      FROM products p
      JOIN company c ON p.company_id = c.id
      WHERE p.sku = ${sku} AND c.admin_id = ${userID}
    `;

    if (!response) {
      return NextResponse.json(
        { error: "no products sku found" },
        { status: 404 },
      );
    }

    return NextResponse.json(response);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "unknown error" }, { status: 500 });
  }

  return;
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
      JOIN company c ON p.company_id = c.id
      WHERE p.sku = ${sku} AND c.admin_id = ${userID}
    `;

    if (product.length === 0) {
      return NextResponse.json(
        { error: "No product found or not authorized to delete" },
        { status: 404 },
      );
    }

    // Step 2: Delete the product safely
    await db`
      DELETE FROM products
      WHERE sku = ${sku}
      AND company_id IN (
        SELECT id FROM company WHERE admin_id = ${userID}
      )
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
