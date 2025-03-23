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
        { error: "Unauthorized: You must be logged in to delete your account" },
        { status: 401 }
      );
    }

    const { password } = await req.json();

    const { error: passwordError } = await supabase.auth.signInWithPassword({
      email: session.user.email,
      password: password,
    });
    const userId = session.user.id;

    const { data: userQuizzes, error: quizzesError } = await supabase
      .from("quizzes")
      .select("id")
      .eq("user_id", userId);

    if (quizzesError) {
      return NextResponse.json(
        { error: "Failed to fetch user quizzes" },
        { status: 400 }
      );
    }

    const quizIds = userQuizzes.map((quiz) => quiz.id);

    const { data: userQuestions, error: questionsError } = await supabase
      .from("questions")
      .select("id")
      .in("quiz_id", quizIds);

    if (questionsError) {
      return NextResponse.json(
        { error: "Failed to fetch user questions" },
        { status: 400 }
      );
    }

    const questionIds = userQuestions.map((question) => question.id);

    const { error: answersError } = await supabase
      .from("answers")
      .delete()
      .in("question_id", questionIds);

    if (answersError) {
      return NextResponse.json(
        { error: "Failed to delete user answers" },
        { status: 400 }
      );
    }

    const { error: questionsDeleteError } = await supabase
      .from("questions")
      .delete()
      .in("quiz_id", quizIds);

    if (questionsDeleteError) {
      return NextResponse.json(
        { error: "Failed to delete user questions" },
        { status: 400 }
      );
    }

    const { error: ratingsError } = await supabase
      .from("ratings")
      .delete()
      .eq("user_id", userId);

    if (ratingsError) {
      return NextResponse.json(
        { error: "Failed to delete user ratings" },
        { status: 400 }
      );
    }

    const { error: userQuizzesError } = await supabase
      .from("userQuizzes")
      .delete()
      .eq("user_id", userId);

    if (userQuizzesError) {
      return NextResponse.json(
        { error: "Failed to delete user quizzes associations" },
        { status: 400 }
      );
    }
    const { error: quizzesDeleteError } = await supabase
      .from("quizzes")
      .delete()
      .eq("user_id", userId);

    if (quizzesDeleteError) {
      return NextResponse.json(
        { error: "Failed to delete user quizzes" },
        { status: 400 }
      );
    }

    const { error: sessionsError } = await supabase
      .from("session")
      .delete()
      .eq("user_id", userId);

    if (sessionsError) {
      return NextResponse.json(
        { error: "Failed to delete user sessions" },
        { status: 400 }
      );
    }

    const { error: accountsError } = await supabase
      .from("account")
      .delete()
      .eq("user_id", userId);

    if (accountsError) {
      return NextResponse.json(
        { error: "Failed to delete user accounts" },
        { status: 400 }
      );
    }

    const { error: deleteUserError } = await supabase
      .from("user")
      .delete()
      .eq("id", userId);

    if (deleteUserError) {
      return NextResponse.json(
        { error: "Failed to delete user account" },
        { status: 400 }
      );
    }

    await auth.api.signOut({
      headers: await headers(),
    });

    return NextResponse.json(
      { success: "Account and all associated data deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
