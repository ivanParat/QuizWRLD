import { NextRequest, NextResponse } from "next/server";
import { getRatingsByUserId } from "@/app/lib/api";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Get ratings from DB
    const ratingsFromDb = await getRatingsByUserId(userId);
    const ratings: Record<string, number> = {};
    for (const r of ratingsFromDb) {
      if (r.quizId) {
        ratings[r.quizId] = r.value;
      }
    }

    // Prepare response and set cookie
    const res = NextResponse.json({ success: true });
    res.cookies.set("quizRatings", JSON.stringify({ ratings }), {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return res;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to sync ratings" }, { status: 500 });
  }
}