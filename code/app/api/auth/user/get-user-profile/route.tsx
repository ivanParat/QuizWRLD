import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import supabase from "@/app/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { profilePicture: null, name: null },
        { status: 200 }
      );
    }
    const { data: profile, error } = await supabase
      .from("user")
      .select("name, image")
      .eq("id", session.user.id)
      .single();

    if (error) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json(
      { profilePicture: profile?.image, name: profile?.name },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching profile:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
