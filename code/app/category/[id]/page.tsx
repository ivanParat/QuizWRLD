import QuizzesSection from "@/app/components/quizzesSection";
import { getCategoryIdFromName, getQuizzesInCategory } from "@/app/lib/api";

export default async function Category({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: categoryName } = await params;
  const { id: categoryId } = await getCategoryIdFromName(categoryName);
  const quizzesInCategory = await getQuizzesInCategory(categoryId);
  const quizzes = quizzesInCategory.map((quiz) => {
    return {
      id: quiz.id,
      title: quiz.title,
      slug: quiz.slug,
      heroImageUrl: quiz.heroImageUrl,
      rating: quiz.rating,
      category: typeof quiz.category === "string" ? quiz.category : quiz.category?.name ?? "Unknown",
    };
  });

  return (
    <main className="min-h-screen bg-off-white pt-4">
      <QuizzesSection
        quizzes={quizzes}
        title={`${categoryName} Quizzes`}
      />
    </main>
  );
}
