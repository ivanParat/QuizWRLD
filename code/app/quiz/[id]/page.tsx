import { getQuizBySlug } from "@/app/lib/api";
import Link from "next/link";
import QuizClient from "../components/quizClient";

type QuizParams = {
  params: Promise<{ id: string }>;
};

export default async function QuizPage({ params }: QuizParams) {
  const { id } = await params;
  const quiz = await getQuizBySlug(id);

  if (!quiz) {
    return (
      <main className="min-h-screen flex flex-col items-center pt-52 px-4 bg-off-white">
        <div className="space-y-4 flex flex-col">
          <div className="text-center text-2xl font-medium text-main-text">
            ❌ Oops! This quiz must have disappeared into the trivia abyss.
          </div>
          <div className="text-center text-2xl font-medium text-main-text">
            🔍 Maybe try searching for another quiz!
          </div>
        </div>
        <Link href={"/discover-quizzes"}>
          <button className="bg-brand text-white px-7 py-1.5 rounded-md hover:bg-brand-hover active:bg-brand-hover font-bold drop-shadow-sm mt-12 text-lg">
            Try another quiz
          </button>
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center pt-10 px-4 bg-off-white">
      <h1 className="text-2xl font-medium mb-10">{quiz.title}</h1>
      <QuizClient quiz={quiz} />
    </main>
  );
}
