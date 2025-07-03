import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import supabase from "@/app/lib/supabase";
import { headers } from "next/headers";

export async function DELETE(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get("id");

    if (!quizId) {
      return NextResponse.json({ error: "Missing quiz ID" }, { status: 400 });
    }

    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select("id")
      .eq("quiz_id", quizId);

    if (questionsError) {
      console.error("Error fetching questions:", questionsError);
      return NextResponse.json(
        { error: "Failed to fetch questions" },
        { status: 500 }
      );
    }

    const questionIds = questions?.map((q) => q.id) || [];

    if (questionIds.length > 0) {
      const { error: answersError } = await supabase
        .from("answers")
        .delete()
        .in("question_id", questionIds);

      if (answersError) {
        console.error("Error deleting answers:", answersError);
        return NextResponse.json(
          { error: "Failed to delete answers" },
          { status: 500 }
        );
      }
    }

    const { error: deleteQuestionsError } = await supabase
      .from("questions")
      .delete()
      .eq("quiz_id", quizId);

    if (deleteQuestionsError) {
      console.error("Error deleting questions:", deleteQuestionsError);
      return NextResponse.json(
        { error: "Failed to delete questions" },
        { status: 500 }
      );
    }

    const { error: ratingsError } = await supabase
      .from("ratings")
      .delete()
      .eq("quiz_id", quizId);

    if (ratingsError) {
      console.error("Error deleting ratings:", ratingsError);
      return NextResponse.json(
        { error: "Failed to delete ratings" },
        { status: 500 }
      );
    }

    const { error: userQuizzesError } = await supabase
      .from("user_quizzes")
      .delete()
      .eq("quiz_id", quizId);

    if (userQuizzesError) {
      console.error("Error deleting user quizzes:", userQuizzesError);
      return NextResponse.json(
        { error: "Failed to delete user quizzes" },
        { status: 500 }
      );
    }

    const { error: quizError } = await supabase
      .from("quizzes")
      .delete()
      .eq("id", quizId);

    if (quizError) {
      console.error("Error deleting quiz:", quizError);
      return NextResponse.json(
        { error: "Failed to delete quiz" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete quiz:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
