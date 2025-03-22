import { auth } from "@/app/lib/auth";
import { authClient } from "@/app/lib/auth-client";
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
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmNewPassword = formData.get("confirmNewPassword") as string;
    const newName = formData.get("name") as string;
    const imageFile = formData.get("image") as File | null;

    const ctx = await auth.$context;

    if (newPassword !== confirmNewPassword) {
      return NextResponse.json(
        { error: "New passwords do not match" },
        { status: 400 }
      );
    }

    const { error: signInError } = await authClient.signIn.email({
      email: session.user.email!,
      password: currentPassword,
    });

    if (signInError) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const hashedPassword = await ctx.password.hash(newPassword);
    await ctx.internalAdapter.updatePassword(session.user.id, hashedPassword);

    let imageUrl = null;
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("profile-pictures")
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error("Supabase Upload Error:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload profile picture" },
          { status: 400 }
        );
      }

      const { data: publicUrl } = supabase.storage
        .from("profile-pictures")
        .getPublicUrl(fileName);
      imageUrl = publicUrl.publicUrl;
    }

    const { error: profileError } = await supabase
      .from("user")
      .update({ name: newName, image: imageUrl })
      .eq("id", session.user.id);

    if (profileError) {
      console.error("Supabase Error:", profileError);
      return NextResponse.json(
        { error: profileError.message || "Failed to update profile" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: "Profile updated successfully!" },
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
