"use client"

import Image from "next/image";
import {TypeCategory} from "../content-types";
import useIsMobile from "../hooks/useIsMobile";

type HomeCategoriesProps = {
  categories: TypeCategory<"WITHOUT_UNRESOLVABLE_LINKS">[];
};

type CategoryCard = {
  category: string;
  color: string;
  image: string;
};

type SectionsProps = {
  title: string;
};

function processCategoryCard(categoryCard: CategoryCard, index: number) {
  const imageUrl = `https:${categoryCard.image}`;
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

export default function CategoriesSection({
  title,
  categories,
}: SectionsProps & HomeCategoriesProps) {
  const isMobile = useIsMobile(); 

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
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-3 xl:gap-5 md:grid-cols-4 px-3 w-full lg:w-[1024px] xl:w-[1200px]">
        {visibleItems.map((categoryCard, index) =>
          processCategoryCard(categoryCard, index)
        )}
      </div>
    </section>
  );
}