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

    const { data: userData, error: fetchError } = await supabase
      .from("user")
      .select("image")
      .eq("id", session.user.id)
      .single();

    if (fetchError || !userData?.image) {
      return NextResponse.json(
        { error: "No profile picture found" },
        { status: 400 }
      );
    }

    const oldFileName = userData.image.split("/").pop();

    const { error: deleteError } = await supabase.storage
      .from("profile-pictures")
      .remove([oldFileName]);

    if (deleteError) {
      return NextResponse.json(
        { error: "Failed to delete profile picture" },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from("user")
      .update({ image: null })
      .eq("id", session.user.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update database" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: "Profile picture removed successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing profile picture:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
