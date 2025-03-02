import { getQuizBySlug } from "@/app/lib/api";
import Image from "next/image";

type QuizParams = {
  params: Promise<{ id: string }>;
};

export default async function QuizPage({ params }: QuizParams) {
  const { id } = await params;
  const quiz = await getQuizBySlug(id);

  if (!quiz) {
    return <div className="text-center mt-10 text-xl">Quiz not found</div>;
  }

  return (
    <main className="flex flex-col items-center p-5">
      <h1 className="text-3xl font-bold mb-4">{quiz.title}</h1>
      <Image
        src={`${quiz.heroImageUrl || "/default-image.png"}`}
        alt={quiz.title}
        width={600}
        height={400}
        className="rounded-md"
      />
      <p className="mt-4">{quiz.description || "No description available."}</p>
      {quiz.questions.map((question) => {
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
      })}
    </main>
  );
}
