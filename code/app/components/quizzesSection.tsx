"use client"

import Image from "next/image";
import {TypeQuizzHomePage} from "../content-types";
import Star from "./star";
import useIsMobile from "../hooks/useIsMobile";

type HomeQuizzProps = {
  quizzes: TypeQuizzHomePage<"WITHOUT_UNRESOLVABLE_LINKS">[];
};

type QuizCard = {
  title: string;
  slug: string;
  rating: number;
  heroImage: string;
  category: { name: string };
};

type QuizCardProps = {
  isMobile: boolean;
}

type SectionsProps = {
  title: string;
};

function processQuizCard(
  quizCard: QuizCard,
  index: number,
  { isMobile }: QuizCardProps
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

export default function QuizzesSection({
  title,
  quizzes,
}: SectionsProps & HomeQuizzProps) {
  const isMobile = useIsMobile();

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
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-3 xl:gap-5 md:grid-cols-4 px-3 w-full lg:w-[1024px] xl:w-[1200px]">
        {visibleItems.map((quizCard, index) =>
          processQuizCard(quizCard, index, { isMobile })
        )}
      </div>
    </section>
  );
}