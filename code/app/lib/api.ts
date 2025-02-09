"use server";
import { unstable_cache } from "next/cache";
import client from "./contentfulClient";
import {
  TypeQuizzSkeleton,
  TypeQuizzHomePageSkeleton,
  TypeCategorySkeleton,
} from "../content-types";

const MINUTE = 60;
const HOUR = 60 * MINUTE;

export const getMainNavigation = unstable_cache(
  async (): Promise<{ title: string; link: string }[]> => {
    try {
      const response = await client.getEntries({ content_type: "navigation" });
      const data = response.items;

      const navigationItems = data.map((item) => ({
        title: String(item.fields.title) || "",
        link: String(item.fields.link) || "",
      }));

      return navigationItems;
    } catch (error) {
      console.error("Error fetching navigation:", error);
      return [];
    }
  },
  ["navigation"],
  { revalidate: HOUR, tags: ["navigation"] }
);

export const getQuizzes = unstable_cache(
  async () => {
    try {
      const data =
        await client.withoutUnresolvableLinks.getEntries<TypeQuizzSkeleton>({
          content_type: "quiz",
          select: [
            "fields.title",
            "fields.slug",
            "fields.description",
            "fields.heroImage",
            "fields.category",
            "fields.questions",
            "fields.rating",
          ],
          include: 1,
        });

      return data.items;
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      return [];
    }
  },
  ["quizzes"],
  { revalidate: HOUR, tags: ["quizzes"] }
);

export const getQuizzesHomePage = unstable_cache(
  async () => {
    try {
      const data =
        await client.withoutUnresolvableLinks.getEntries<TypeQuizzHomePageSkeleton>(
          {
            content_type: "quiz",
            select: [
              "fields.title",
              "fields.slug",
              "fields.heroImage",
              "fields.category",
              "fields.rating",
            ],
            include: 1,
          }
        );

      return data.items;
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      return [];
    }
  },
  ["quizzes"],
  { revalidate: HOUR, tags: ["quizzes"] }
);

export const getCategories = unstable_cache(
  async () => {
    try {
      const data =
        await client.withoutUnresolvableLinks.getEntries<TypeCategorySkeleton>({
          content_type: "category",
          select: ["fields.name", "fields.color", "fields.image"],
          include: 1,
        });

      return data.items;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },
  ["categories"],
  { revalidate: HOUR, tags: ["categories"] }
);

export const getQuizBySlug = async (slug: string) => {
  try {
    const data =
      await client.withoutUnresolvableLinks.getEntries<TypeQuizzSkeleton>({
        content_type: "quiz",
        select: [
          "fields.title",
          "fields.slug",
          "fields.description",
          "fields.heroImage",
          "fields.category",
          "fields.questions",
          "fields.rating",
        ],
        "fields.slug": slug,
        include: 2,
      });

    if (!data.items.length) {
      return null;
    }

    return data.items[0];
  } catch (error) {
    console.error(`Error fetching quiz with slug ${slug}:`, error);
    return null;
  }
};
