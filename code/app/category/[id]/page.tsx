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
      category: { name: quiz.category.name },
    };
  });

  return (
    <div>
      <QuizzesSection
        quizzes={quizzes}
        title={`Quizzes in category ${categoryName}`}
      />
    </div>
  );
}
