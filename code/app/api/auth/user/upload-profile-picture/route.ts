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

    const formData = await req.formData();
    const imageFile = formData.get("image") as File;

    const { data: userData, error: fetchError } = await supabase
      .from("user")
      .select("image")
      .eq("id", session.user.id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: "Failed to fetch user data" },
        { status: 400 }
      );
    }

    if (userData?.image) {
      const oldFileName = userData.image.split("/").pop();

      const { error: deleteError } = await supabase.storage
        .from("profile-pictures")
        .remove([oldFileName]);

      if (deleteError) {
        console.error("Failed to delete old profile picture:", deleteError);
        return NextResponse.json(
          { error: "Failed to delete old profile picture" },
          { status: 400 }
        );
      }
    }

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("profile-pictures")
      .upload(fileName, imageFile);

    if (uploadError) {
      return NextResponse.json(
        { error: "Failed to upload profile picture" },
        { status: 400 }
      );
    }

    const { data: publicUrl } = supabase.storage
      .from("profile-pictures")
      .getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from("user")
      .update({ image: publicUrl.publicUrl })
      .eq("id", session.user.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update profile picture in database" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: "Profile picture uploaded successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
