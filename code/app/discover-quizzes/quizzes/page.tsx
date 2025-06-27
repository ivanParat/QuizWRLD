import QuizzesSection from "@/app/components/quizzesSection";
import { getAllQuizzes, getQuizzesByRating, getQuizzesByNewest } from "@/app/lib/api";

export default async function DiscoverQuizzesPage() {
  const recommendedQuizzes = await getAllQuizzes();
  const popularQuizzes = await getQuizzesByRating();
  const newestQuizzes = await getQuizzesByNewest();
  return (
    <main className="flex min-h-screen flex-col items-center bg-off-white">
      <QuizzesSection quizzes={recommendedQuizzes} title="Recommended Quizzes"/>
      <QuizzesSection quizzes={popularQuizzes} title="Popular Quizzes"/>
      <QuizzesSection quizzes={newestQuizzes} title="Recently Added Quizzes"/>
    </main>
  );
}
