import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import supabase from "@/app/lib/supabase";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: You must be logged in" },
        { status: 401 }
      );
    }

    const { data: userData, error: fetchError } = await supabase
      .from("user")
      .select("image")
      .eq("id", session.user.id)
      .single();

    if (fetchError || !userData?.image) {
      return NextResponse.json(
        { error: "No profile picture found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ imageUrl: userData.image }, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
