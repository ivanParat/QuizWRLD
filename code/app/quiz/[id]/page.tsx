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
      <h1 className="text-3xl font-bold mb-4">{quiz.fields.title}</h1>
      <Image
        src={`https:${
          quiz.fields.heroImage?.fields?.file?.url || "/default-image.png"
        }`}
        alt={quiz.fields.title}
        width={600}
        height={400}
        className="rounded-md"
      />
      <p className="mt-4">
        {quiz.fields.description || "No description available."}
      </p>
      {quiz.fields.questions.map((question) => {
        if (!question) return null;
        console.log(question);
        return (
          <div key={question.sys.id}>
            <h3>{question.fields.title}</h3>
            <ul>
              {question.fields.answers.map((answer) => {
                if (!answer) return null;

                return (
                  <li key={answer.sys.id}>
                    {answer.fields.text}
                    {answer.fields.isCorrect && " (Correct)"}
                  </li>
                );
              })}
            </ul>
            <p>
              Correct answer:{" "}
              {question.fields.correctAnswer?.fields.text || "Not available"}
            </p>
          </div>
        );
      })}
    </main>
  );
}
