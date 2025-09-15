import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://neonstatus.com/api/v1/summary");
    const ok = response.ok;

    return NextResponse.json({
      healthDB: ok,
      message: ok ? "Database is Online" : "Database is Offline",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { healthDB: false, message: "Error checking database" },
      { status: 500 }
    );
  }
}
