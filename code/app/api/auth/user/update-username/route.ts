import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import supabase from "@/app/lib/supabase";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: You must be logged in to update your profile" },
        { status: 401 }
      );
    }

    const { name: newName } = await req.json();

    const { error: profileError } = await supabase
      .from("user")
      .update({ name: newName })
      .eq("id", session.user.id);

    if (profileError) {
      console.error("Error updating profile:", profileError);
      return NextResponse.json(
        { error: "Failed to update username" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: "Username updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
