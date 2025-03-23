import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { authClient } from "@/app/lib/auth-client";

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

    const { currentPassword, newPassword, confirmNewPassword } =
      await req.json();

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

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

    return NextResponse.json(
      { success: "Password updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
