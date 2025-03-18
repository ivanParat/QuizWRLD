import { getQuizBySlug } from "@/app/lib/api";
import Image from "next/image";
import Link from "next/link";

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
          <div className="text-center text-2xl font-medium text-main-text">❌ Oops! This quiz must have disappeared into the trivia abyss.</div>
          <div className="text-center text-2xl font-medium text-main-text">🔍 Maybe try searching for another quiz!</div>
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
      <h1 className="text-3xl font-bold mb-4">{quiz.title}</h1>
      <Image
        src={`${quiz.heroImageUrl || "/default-image.png"}`}
        alt={quiz.title}
        width={500}
        height={400}
        className="rounded-md"
      />
      <p className="mt-4">{quiz.description || "No description available."}</p>
      {/* {quiz.questions.map((question) => {
        if (!question) return null;
        console.log(question);
        return (
          <div key={question.id}>
            <h3>{question.title}</h3>
            <ul>
              {question.answers.map((answer) => {
                if (!answer) return null;

                return (
                  <li key={answer.id}>
                    {answer.text}
                    {answer.isCorrect && " (Correct)"}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })} */}
      <button className="bg-brand text-white px-10 py-1.5 rounded-md hover:bg-brand-hover active:bg-brand-hover font-bold drop-shadow-sm mt-12 text-lg">
        Begin
      </button>
    </main>
  );
}
