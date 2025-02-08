import { getCategories, getQuizzesHomePage } from "./lib/api";
import Home from "./Home";

export default async function HomePage() {
  const quizzes = await getQuizzesHomePage();
  const categories = await getCategories();

  return <Home quizzes={quizzes} categories={categories} />;
}
