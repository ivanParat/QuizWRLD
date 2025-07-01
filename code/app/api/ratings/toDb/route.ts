import { NextRequest, NextResponse } from "next/server";
import { syncRatingsCookieToDb } from "@/app/lib/cookiesServer";

export async function POST(req: NextRequest) {
  try {
    let body: any;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      body = await req.json();
    } else {
      // For sendBeacon (text/plain)
      const text = await req.text();
      body = JSON.parse(text);
    }

    const { userId, ratings } = body;
    if (!userId || !ratings) {
      return NextResponse.json({ error: "Missing userId or ratings" }, { status: 400 });
    }
    await syncRatingsCookieToDb(userId, ratings);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to sync ratings:", error);
    return NextResponse.json({ error: "Failed to sync ratings" }, { status: 500 });
  }
}