import { getQuizzesHomePage } from "./lib/api";
import Home from "./Home";

export default async function HomePage() {
  const quizzes = await getQuizzesHomePage();

  return <Home quizzes={quizzes} />;
}
