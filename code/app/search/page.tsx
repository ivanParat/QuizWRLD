"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import NotFound from "../not-found";
import Loading from "../loading";
import QuizzesSection from "../components/quizzesSection";
import CategoriesSection from "../components/categoriesSection";

import { quizzes, categories } from "../db/schema";
import { InferSelectModel } from "drizzle-orm";
import { getQuizzesByQuery, getCategoriesByQuery } from "../lib/api";

type Quiz = InferSelectModel<typeof quizzes>;
type QuizCard = Pick<Quiz, "id" | "title" | "slug" | "heroImageUrl"> & {
  rating: number;
  category: { name: string };
};
type Category = InferSelectModel<typeof categories>;
type CategoryCard = Pick<Category, "id" | "name" | "imageUrl" | "color">;

export default function SearchPage() {
  const searchParams = useSearchParams(); 
  const query = searchParams.get("q");

  const [quizzesResult, setQuizzesResult] = useState<QuizCard[]>([]);
  const [categoriesResult, setCategoriesResult] = useState<CategoryCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!query) {
      setQuizzesResult([]);
      setCategoriesResult([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(false);
      try {
        const [matchingQuizzes, matchingCategories] = await Promise.all([
          getQuizzesByQuery(query),
          getCategoriesByQuery(query),
        ]);

        setQuizzesResult(matchingQuizzes);
        setCategoriesResult(matchingCategories);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (!query) return <NotFound/>;
  if (error) return <NotFound/>;
  if (loading) return <Loading/>;

  return (
    <main className="flex min-h-screen flex-col items-center">
      <QuizzesSection title="Quizzes" quizzes={quizzesResult}/>
      <CategoriesSection title="Categories" categories={categoriesResult}/>
    </main>
  );
}
