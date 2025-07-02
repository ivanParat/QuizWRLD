import { NextResponse } from "next/server";
import supabase from "@/app/lib/supabase";

export async function PATCH(request: Request) {
  try {
    const url = new URL(request.url);
    const quizId = url.searchParams.get("id");
    if (!quizId) {
      return NextResponse.json({ error: "Missing quiz id" }, { status: 400 });
    }

    const body = await request.json();
    const { published } = body;

    if (typeof published !== "boolean") {
      return NextResponse.json(
        { error: "Missing or invalid 'published' value" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("quizzes")
      .update({ published })
      .eq("id", quizId);

    if (error) {
      console.error("Failed to update publish status:", error);
      return NextResponse.json(
        { error: "Failed to update publish status" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, published }, { status: 200 });
  } catch (error) {
    console.error("Error toggling publish:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
