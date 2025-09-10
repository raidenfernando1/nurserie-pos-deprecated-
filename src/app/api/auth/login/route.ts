import auth from "@/lib/auth-server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { type, email, password } = await req.json();
}
