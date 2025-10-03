import { NextResponse } from "next/server";
import { db } from "@/lib/db-client";
import { headers } from "next/headers";
import auth from "@/lib/auth-server";

interface UpdateProductBody {
  id: string;
  name?: string;
  description?: string;
  brand?: string;
  category?: string;
  price?: number;
  image_url?: string;
}

export async function PATCH(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userID = session.user.id;

    if (!userID) {
      return NextResponse.json(
        { error: "Unauthorized - User ID required" },
        { status: 401 },
      );
    }

    const body: UpdateProductBody = await request.json();

    // Extract fields from body
    const { id, name, description, brand, category, price, image_url } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    // Execute the update query
    const result = await db`
      UPDATE products p
      SET
        name = COALESCE(${name}, p.name),
        description = COALESCE(${description}, p.description),
        brand = COALESCE(${brand}, p.brand),
        category = COALESCE(${category}, p.category),
        price = COALESCE(${price}, p.price),
        image_url = COALESCE(${image_url}, p.image_url)
        AND c.admin_id = ${userID}
        AND p.id = ${id}
      RETURNING p.*;
    `;

    // Check if product was updated
    if (result.length === 0) {
      return NextResponse.json(
        { error: "Product not found or unauthorized" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      product: result[0],
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
