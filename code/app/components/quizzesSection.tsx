"use client";

import Image from "next/image";
import Link from "next/link";
import Stars from "./stars";
import useIsMobile from "../hooks/useIsMobile";
import { InferSelectModel } from "drizzle-orm";
import { quizzes } from "../db/schema";
import { useState, useEffect } from "react";
import { ChevronDown } from 'lucide-react';

type Quiz = InferSelectModel<typeof quizzes>;
type QuizCard = Pick<Quiz, "id" | "title" | "slug" | "heroImageUrl"> & {
  rating: number;
  category: string ;
};

type QuizCardProps = {
  isMobile: boolean;
};

type SectionsProps = {
  title: string;
  quizzes: QuizCard[];
};

function processQuizCard(
  quizCard: QuizCard,
  index: number,
  { isMobile }: QuizCardProps
) {
  return (
    <Link href={`/quiz/${quizCard.slug}`} key={index} className="transition duration-200 sm:hover:brightness-110 sm:active:brightness-125">
      <div className="rounded-md overflow-hidden relative aspect-[1/1] lg:aspect-[4/3]">
        <Image
          src={quizCard.heroImageUrl || "/images/placeholder.png"}
          alt="Quiz image"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black flex flex-col justify-end px-1.5 py-1 text-white">
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-[14px] md:text-[15px] font-semibold">
                {quizCard.title}
              </h3>
            </div>
            <div className="flex justify-between">
              <p className="text-[12px] md:text-[13px]">
                {quizCard.category}
              </p>
              <Stars avgRating={quizCard.rating} isMobile={isMobile} quizId={quizCard.id}/>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function QuizzesSection({ title, quizzes }: SectionsProps) {
  const isMobile = useIsMobile();
  const [n, setn] = useState<number>(isMobile ? 6 : 8)
  const visibleItems = quizzes.slice(0, n);

  useEffect(() => {
    if(n === 6 || n === 8){
      setn(isMobile ? 6 : 8)
    }
  }, [isMobile])

  function handleClickMore(){
    const m = isMobile? 6 : 8;
    let i = m;
    while(true){
      if(i > quizzes.length){
        setn(quizzes.length);
        return;
      }
      if(i > n){
        setn(i);
        return;
      }
      i += m;
    }
  }

  if(quizzes.length === 0) return (
    <section className="mt-6 mb-10 xl:mb-14 w-full flex flex-col items-center">
      <h2 className="text-center text-2xl md:text-3xl font-bold mb-6 xl:mb-8">
        {title}
      </h2>
      <div className="flex justify-center items-center px-3 w-full lg:w-[1024px] xl:w-[1200px]">
        <p className="text-xl text-secondary-text font-regular flex items-center">No quizzes found</p>
      </div>
    </section>
  );

  return (
    <section className="mt-6 mb-10 xl:mb-14 w-full flex flex-col items-center">
      <h2 className="text-center text-2xl md:text-3xl font-bold mb-6 xl:mb-8">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-3 xl:gap-5 md:grid-cols-4 px-3 w-full lg:w-[1024px] xl:w-[1200px]">
        {visibleItems.map((quizCard, index) =>
          processQuizCard(quizCard, index, { isMobile })
        )}
      </div>
      {
        n < quizzes.length &&
        <button onClick={()=>{handleClickMore()}} className="flex mt-6 text-lg font-medium text-main-text sm:hover:text-brand sm:active:text-brand">
          <span>More</span>
          <ChevronDown size={28}/>
        </button>
      }
    </section>
  );
}
