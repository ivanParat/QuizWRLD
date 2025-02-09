"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { TypeCategory, TypeQuizzHomePage } from "./content-types";
import { Key, Link } from "lucide-react";
type HomeQuizzProps = {
  quizzes: TypeQuizzHomePage<"WITHOUT_UNRESOLVABLE_LINKS">[];
};
type HomeCategoriesProps = {
  categories: TypeCategory<"WITHOUT_UNRESOLVABLE_LINKS">[];
};

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
          <button className="font-semibold md:text-lg bg-brand text-white px-8 md:px-10 py-[7px] mt-4 rounded-md hover:bg-brand-hover active:bg-brand-hover">
            Solve Quiz
          </button>
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

type QuizCard = {
  title: string;
  slug: string;
  rating: number;
  heroImage: string;
  category: { name: string };
};

type CategoryCard = {
  category: string;
  color: string;
  image: string;
};

type StarProps = {
  filled: "yes" | "no" | "half";
  isMobile: boolean;
};

function Star({ filled, isMobile }: StarProps) {
  const color = "#FFC107";
  const size = isMobile ? "16px" : "19px";
  const viewBox = "0 -850 800 800";
  if (filled === "yes") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={size}
        viewBox={viewBox}
        width={size}
        fill={color}
      >
        <path d="m280.31-197.08 75.77-245.61L158.31-604h243.31L480-842.76 558.38-604h243.31L603.92-442.69l75.77 245.61L480-348.62 280.31-197.08Z" />
      </svg>
    );
  } else if (filled === "half") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={size}
        viewBox={viewBox}
        width={size}
        fill={color}
      >
        <path d="M480-678v263l102 78-38-124 114-91H521l-41-126ZM280.31-197.08l75.77-245.61L158.31-604h243.31L480-842.76 558.38-604h243.31L603.92-442.69l75.77 245.61L480-348.62 280.31-197.08Z" />
      </svg>
    );
  } else {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={size}
        viewBox={viewBox}
        width={size}
        fill={color}
      >
        <path d="m378-337 102-78 102 78-38-124 114-91H521l-41-126-40 126H302l115 91-39 124Zm-97.69 139.92 75.77-245.61L158.31-604h243.31L480-842.76 558.38-604h243.31L603.92-442.69l75.77 245.61L480-348.62 280.31-197.08ZM480-508Z" />
      </svg>
    );
  }
}

type PopularSectionsProps = {
  isMobile: boolean;
};

function processQuizCard(
  quizCard: QuizCard,
  index: number,
  { isMobile }: PopularSectionsProps
) {
  const imageUrl = `https:${quizCard.heroImage}`;
  return (
    <a href={`/quiz/${quizCard.slug}`} key={index}>
      <div className="rounded-md overflow-hidden relative aspect-[1/1] lg:aspect-[4/3]">
        <Image src={imageUrl} alt="Quiz image" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black flex flex-col justify-end px-1.5 py-1 text-white">
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-[14px] md:text-[15px] font-semibold">
                {quizCard.title}
              </h3>
            </div>
            <div className="flex justify-between">
              <p className="text-[12px] md:text-[13px]">
                {quizCard.category.name}
              </p>
              <div className="flex items-end">
                <span className="flex">
                  {[1, 2, 3, 4, 5].map((i) => {
                    const isFull =
                      i <= Math.floor(quizCard.rating) ||
                      (i === Math.floor(quizCard.rating) + 1 &&
                        quizCard.rating % 1 >= 0.75);
                    const isHalf =
                      i === Math.floor(quizCard.rating) + 1 &&
                      quizCard.rating % 1 >= 0.25;
                    const filled = isFull ? "yes" : isHalf ? "half" : "no";

                    return <Star key={i} filled={filled} isMobile={isMobile} />;
                  })}
                </span>
                <span className="hidden  md:block text-[11px] md:text-[13px] ml-1.5 font-medium">
                  {quizCard.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

function processCategoryCard(categoryCard: CategoryCard, index: number) {
  const imageUrl = `https:${categoryCard.image}`;
  console.log(categoryCard.color);
  return (
    <div
      key={index}
      className={`rounded-md overflow-hidden relative bg-gradient-to-tr aspect-[1/1] lg:aspect-[4/3]`}
    >
      <Image src={imageUrl} alt="Quiz image" fill className="object-cover" />
      <div
        className="absolute inset-0 bg-gradient-to-b flex flex-col justify-end px-1.5 py-1 text-white"
        style={{
          backgroundImage: `linear-gradient(to bottom, transparent, ${categoryCard.color})`,
        }}
      >
        <div className="flex flex-row justify-between">
          <h3 className="text-[15px] md:text-[17px] font-semibold">
            {categoryCard.category}
          </h3>
        </div>
      </div>
    </div>
  );
}

function PopularQuizzesSection({
  isMobile,
  quizzes,
}: PopularSectionsProps & HomeQuizzProps) {
  const quizCards: QuizCard[] = quizzes.map((quiz) => ({
    title: quiz.fields.title,
    slug: quiz.fields.slug,
    rating: quiz.fields.rating,
    heroImage: quiz.fields.heroImage?.fields?.file?.url || "/default-image.png",
    category: {
      name: quiz.fields.category?.fields?.name || "Unknown",
    },
  }));

  const visibleItems: QuizCard[] = isMobile ? quizCards.slice(0, 6) : quizCards;
  return (
    <section className="mb-10 xl:mb-14 w-full flex flex-col items-center">
      <h2 className="text-center text-2xl md:text-3xl font-bold mb-6 xl:mb-8">
        Popular Quizzes
      </h2>
      <div className="grid grid-cols-2 gap-3 xl:gap-5 md:grid-cols-4 px-3 w-full lg:w-[1024px] xl:w-[1200px]">
        {visibleItems.map((quizCard, index) =>
          processQuizCard(quizCard, index, { isMobile })
        )}
      </div>
    </section>
  );
}

function PopularCategoriesSection({
  isMobile,
  categories,
}: PopularSectionsProps & HomeCategoriesProps) {
  const categoryCards: CategoryCard[] = categories.map((category) => ({
    category: category.fields.name,
    color: category.fields.color || "000000",
    image: category.fields?.image?.fields?.file?.url || "/default-image.png",
  }));
  const visibleItems: CategoryCard[] = isMobile
    ? categoryCards.slice(0, 6)
    : categoryCards;
  return (
    <section className="mb-10 xl:mb-14 w-full flex flex-col items-center">
      <h2 className="text-center text-2xl md:text-3xl font-bold mb-6 xl:mb-8">
        Popular Categories
      </h2>
      <div className="grid grid-cols-2 gap-3 xl:gap-5 md:grid-cols-4 px-3 w-full lg:w-[1024px] xl:w-[1200px]">
        {visibleItems.map((categoryCard, index) =>
          processCategoryCard(categoryCard, index)
        )}
      </div>
    </section>
  );
}

export default function Home({
  quizzes,
  categories,
}: HomeQuizzProps & HomeCategoriesProps) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    const updateView = () => setIsMobile(window.innerWidth < 768);
    updateView();
    window.addEventListener("resize", updateView);
    return () => window.removeEventListener("resize", updateView);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <HeroSection />
      <div className="h-32 w-full bg-gradient-to-b from-off-white to-white"></div>
      <PopularQuizzesSection quizzes={quizzes} isMobile={isMobile} />
      <PopularCategoriesSection categories={categories} isMobile={isMobile} />
    </main>
  );
}
