"use client"

import Image from "next/image";
import { useState } from "react";
import QuestionCard from "./questionCard";
import { FinalBox } from "./questionCard";

type Quiz = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  heroImageUrl: string | null;
  category: string | null;
  rating: number;
  questions: {
    id: string;
    title: string;
    order: number;
    answers: {
        id: string;
        text: string;
        isCorrect: boolean;
        order: number;
    }[];
  }[];
}

export default function QuizClient({ quiz }: { quiz: Quiz }){
  const [hasBegun, setHasBegun] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!hasBegun)
  return(
    <>
      <Image
        src={`${quiz.heroImageUrl || "/default-image.png"}`}
        alt={quiz.title}
        width={500}
        height={400}
        className="rounded-md"
      />
      <p className="mt-4 text-lg">{quiz.description || "No description available."}</p>
      <button 
        className="bg-brand text-white px-10 py-1.5 rounded-md hover:bg-brand-hover active:bg-brand-hover font-bold drop-shadow-sm mt-8 text-lg"
        onClick={() => setHasBegun(true)}
      >
        Begin
      </button>
    </>
  );

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleAnswerClick = (answerId: string, isCorrect: boolean) => {
    setSelectedAnswer(answerId);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex + 1 < quiz.questions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setIsFinished(true);
      }
    }, 1300); // Delay for UI feedback
  };

  if (isFinished) {
    return (
      <FinalBox score={score} nOfQuestions={quiz.questions.length} />
    );
  }

  return (
    <QuestionCard
      currentQuestion={currentQuestion}
      currentQuestionIndex={currentQuestionIndex}
      totalQuestions={quiz.questions.length}
      selectedAnswer={selectedAnswer}
      onAnswerClick={handleAnswerClick}
    />
  );
}