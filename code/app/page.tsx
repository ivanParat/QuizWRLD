import { getAllQuizzes, getAllCategories } from "./lib/api";
import Image from "next/image";
import Link from "next/link";
import QuizzesSection from "./components/quizzesSection";
import CategoriesSection from "./components/categoriesSection";

function HeroSection() {
  return (
    <section className="flex flex-col md:flex-row md:items-center md:justify-center md:space-x-20 bg-off-white w-full pt-[122px] md:pt-20 pb-20 space-y-10">
      <div className="flex flex-col px-3 space-y-2 items-center md:items-start">
        <h2 className="text-center md:text-left font-extrabold text-main-text text-[27px] md:text-5xl md:leading-[60px] md:max-w-96">
          Challenge your knowledge!
        </h2>
        <p className="text-center md:text-left font-normal text-[13px] md:text-base text-secondary-text max-w-80">
          Create or solve fun and challenging quizzes instantly. Learn something
          new, expand your horizons, and explore a world of trivia!
        </p>
        <div className="flex justify-center">
          <Link href="/discover-quizzes/quizzes">
            <button className="font-semibold md:text-lg bg-brand text-white px-8 md:px-10 py-[7px] mt-4 rounded-md hover:bg-brand-hover active:bg-brand-hover">
              Solve Quiz
            </button>
          </Link>
        </div>
      </div>
      <div className="py-10 md:py-0">
        <div className="relative h-52 md:h-96 md:w-96">
          <Image
            fill
            src="/images/undraw_online_test_re_kyfx.svg"
            alt="Online quiz vector graphic"
            priority={true}
          />
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const categories = await getAllCategories();
  const quizzes = await getAllQuizzes();

  return (
    <main className="flex min-h-screen flex-col items-center">
      <HeroSection />
      <div className="h-32 w-full bg-gradient-to-b from-off-white to-white"></div>
      <QuizzesSection quizzes={quizzes} title="Popular Quizzes" />
      <CategoriesSection
        categories={categories}
        title="Popular Categories"
      />
    </main>
  );
}
