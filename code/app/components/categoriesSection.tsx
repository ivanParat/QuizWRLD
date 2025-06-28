"use client";

import Image from "next/image";
import useIsMobile from "../hooks/useIsMobile";
import { categories } from "../db/schema";
import { InferSelectModel } from "drizzle-orm";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronDown } from 'lucide-react';

type Category = InferSelectModel<typeof categories>;

type CategoryCard = Pick<Category, "id" | "name" | "imageUrl" | "color">;

type SectionsProps = {
  title: string;
  categories: CategoryCard[];
};

function processCategoryCard(categoryCard: CategoryCard, index: number) {
  return (
    <Link href={`/category/${categoryCard.name}`} key={index} className="transition duration-200 hover:brightness-110 active:brightness-125">
      <div
        key={index}
        className={`rounded-md overflow-hidden relative bg-gradient-to-tr aspect-[1/1] lg:aspect-[4/3]`}
      >
        <Image
          src={categoryCard.imageUrl || "/images/placeholder.png"}
          alt="Quiz image"
          fill
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b flex flex-col justify-end px-1.5 py-1 text-white"
          style={{
            backgroundImage: `linear-gradient(to bottom, transparent, ${categoryCard.color})`,
          }}
        >
          <div className="flex flex-row justify-between">
            <h3 className="text-[15px] md:text-[17px] font-semibold">
              {categoryCard.name}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CategoriesSection({
  title,
  categories,
}: SectionsProps) {
  const isMobile = useIsMobile();
  const [n, setn] = useState<number>(isMobile ? 6 : 8)
  const visibleItems = categories.slice(0, n);

  useEffect(() => {
    if(n === 6 || n === 8){
      setn(isMobile ? 6 : 8)
    }
  }, [isMobile])

  function handleClickMore(){
    const m = isMobile? 6 : 8;
    let i = m;
    while(true){
      if(i > categories.length){
        setn(categories.length);
        return;
      }
      if(i > n){
        setn(i);
        return;
      }
      i += m;
    }
  }

  if(categories.length === 0) return (
    <section className="mt-6 mb-10 xl:mb-14 w-full flex flex-col items-center">
      <h2 className="text-center text-2xl md:text-3xl font-bold mb-6 xl:mb-8">
        {title}
      </h2>
      <div className="flex justify-center items-center px-3 w-full lg:w-[1024px] xl:w-[1200px]">
        <p className="text-xl text-secondary-text font-regular flex items-center">No categories found</p>
      </div>
    </section>
  );

  return (
    <section className="mb-10 xl:mb-14 w-full flex flex-col items-center">
      <h2 className="text-center text-2xl md:text-3xl font-bold mb-6 xl:mb-8">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-3 xl:gap-5 md:grid-cols-4 px-3 w-full lg:w-[1024px] xl:w-[1200px]">
        {visibleItems.map((categoryCard, index) =>
          processCategoryCard(categoryCard, index)
        )}
      </div>
      {
        n < categories.length &&
        <button onClick={()=>{handleClickMore()}} className="flex mt-6 text-lg font-medium text-main-text hover:text-brand active:text-brand">
          <span>More</span>
          <ChevronDown size={28}/>
        </button>
      }
    </section>
  );
}
