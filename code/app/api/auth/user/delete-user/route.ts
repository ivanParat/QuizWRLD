import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { authClient } from "@/app/lib/auth-client";
import supabase from "@/app/lib/supabase";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: No active session" },
        { status: 401 }
      );
    }

    const { password } = await req.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const { error: signInError } = await authClient.signIn.email({
      email: session.user.email!,
      password,
    });

    if (signInError) {
      console.error("Password verification failed:", signInError);
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // 3. Execute atomic deletion through PostgreSQL RPC call
    const { error: deletionError } = await supabase.rpc("delete_user_data", {
      p_user_id: session.user.id, // Make sure you use p_user_id here
    });

    if (deletionError) {
      console.error("Database deletion failed:", deletionError);
      return NextResponse.json(
        { error: deletionError.message || "Account deletion failed" },
        { status: 400 }
      );
    }

    // 4. Sign out the user after successful deletion
    await auth.api.signOut({
      headers: await headers(),
    });

    return NextResponse.json(
      { success: true, message: "Account deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
