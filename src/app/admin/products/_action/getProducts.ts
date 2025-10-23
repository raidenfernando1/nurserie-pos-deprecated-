"use server";

import { db } from "@/lib/db-client";
import auth from "@/lib/auth-server";
import { headers } from "next/headers";

import type { Product } from "@/types/product";

interface FetchProductsError {
  error: string;
  status: number;
}

type FetchProductsResult = Product[] | FetchProductsError;

export default async function fetchProducts(): Promise<FetchProductsResult> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return { error: "Unauthorized", status: 401 };
    }

    const response = await db`
    SELECT
      p.id,
      p.name,
      p.brand,
      p.category,
      p.image_url,
      p.price,
      p.cost,
      p.sku,
      p.barcode
    FROM products p
    ORDER BY p.name;
  `;

    return response as Product[];
  } catch (err) {
    console.error("fetchProducts error:", err);
    return { error: "Failed to fetch products", status: 500 };
  }
}
