import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://neonstatus.com/api/v1/summary");
    if (!res.ok) throw new Error();

    const data = await res.json();

    const region = data.subpages?.find(
      (subpage: any) => subpage.subpage === "aws-asia-pacific-singapore",
    );

    return NextResponse.json({ health: !!region }, { status: 200 });
  } catch (err) {
    console.error("❌ Health check failed:", err);
    return NextResponse.json({ health: false }, { status: 500 });
  }
}
