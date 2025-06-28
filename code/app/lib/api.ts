"use server";
import { unstable_cache } from "next/cache";
import client from "./contentfulClient";
import {
  TypeQuizzHomePageSkeleton,
  TypeAboutUsSkeleton,
  TypeBlogSkeleton,
} from "../content-types";
import { db } from "../db/drizzle";
import { answers, categories, questions, quizzes, ratings } from "../db/schema";
import { eq, sql, and, like } from "drizzle-orm";
import CategoriesSection from "../components/categoriesSection";
import { Entry } from "contentful";

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

async function getQuizzes() {
  try {
    const data = await db
      .select({
        id: quizzes.id,
        title: quizzes.title,
        slug: quizzes.slug,
        heroImageUrl: quizzes.heroImageUrl,
        category: sql<{
          name: string;
        }>`COALESCE(${categories.name}, 'Unknown')`,
        rating: sql<number>`COALESCE(AVG(${ratings.value}), 0)`,
      })
      .from(quizzes)
      .leftJoin(categories, eq(quizzes.categoryId, categories.id))
      .leftJoin(ratings, eq(quizzes.id, ratings.quizId))
      .where(eq(quizzes.published, true))
      .groupBy(quizzes.id, categories.name);

    return data;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw new Error("An error occurred while fetching quizzes.");
  }
}

export const getAllQuizzes = unstable_cache(getQuizzes, ["quizzes"], {
  revalidate: HOUR,
  tags: ["quizzes"],
});

export async function getQuizBySlug(slug: string) {
  try {
    const data = await db
      .select({
        id: quizzes.id,
        title: quizzes.title,
        slug: quizzes.slug,
        description: quizzes.description,
        heroImageUrl: quizzes.heroImageUrl,
        category: categories.name,
        rating: sql<number>`COALESCE(AVG(${ratings.value}), 0)`,
        questions: sql<
          {
            id: string;
            title: string;
            order: number;
            answers: {
              id: string;
              text: string;
              isCorrect: boolean;
              order: number;
            }[];
          }[]
        >`COALESCE(JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', ${questions.id},
            'title', ${questions.title},
            'order', ${questions.order},
            'answers', COALESCE((
              SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', ${answers.id},
                  'text', ${answers.text},
                  'isCorrect', ${answers.isCorrect},
                  'order', ${answers.order}
                )
              ) FROM ${answers} WHERE ${answers.questionId} = ${questions.id}
            ), '[]'::json)
          )
        ) FILTER (WHERE ${questions.id} IS NOT NULL), '[]'::json)`,
      })
      .from(quizzes)
      .leftJoin(categories, eq(quizzes.categoryId, categories.id))
      .leftJoin(ratings, eq(quizzes.id, ratings.quizId))
      .leftJoin(questions, eq(quizzes.id, questions.quizId))
      .where(and(eq(quizzes.slug, slug), eq(quizzes.published, true)))
      .groupBy(quizzes.id, categories.name);

    if (!data.length) {
      return null;
    }

    return data[0];
  } catch (error) {
    console.error(`Error fetching quiz with slug ${slug}:`, error);
    throw new Error("An error occurred while fetching the quiz.");
  }
}

async function getCategories() {
  try {
    const data = await db
      .select({
        id: categories.id,
        name: categories.name,
        color: categories.color,
        imageUrl: categories.imageUrl,
      })
      .from(categories);

    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("An error occurred while fetching categories.");
  }
}

export async function getCategoryIdFromName(categoryName: string) {
  try {
    const data = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.name, categoryName));

    return data[0];
  } catch (error) {
    console.error("Error while fetching category id: ", error);
    throw new Error("An error occured while fetching category id.");
  }
}
export async function getQuizzesInCategory(categoryId: number) {
  try {
    const data = await db
      .select({
        id: quizzes.id,
        title: quizzes.title,
        slug: quizzes.slug,
        heroImageUrl: quizzes.heroImageUrl,
        category: sql<{
          name: string;
        }>`COALESCE(${categories.name}, 'Unknown')`,
        rating: sql<number>`COALESCE(AVG("ratings"."value"), 0)`,
      })
      .from(quizzes)
      .leftJoin(categories, eq(quizzes.categoryId, categories.id))
      .leftJoin(ratings, eq(quizzes.id, ratings.quizId))
      .where(eq(quizzes.categoryId, categoryId))
      .groupBy(quizzes.id, categories.name);

    return data;
  } catch (error) {
    console.error("Error while fetching quizzes from category: ", error);
    throw new Error("An error occured while fetching quizzes from category.");
  }
}

export const getAllCategories = unstable_cache(getCategories, ["categories"], {
  revalidate: HOUR,
  tags: ["categories"],
});

export const getAboutUs = unstable_cache(
  async (): Promise<{
    title1: string;
    description1: string;
    image1: string | null;
    title2: string;
    description2: string;
    image2: string | null;
  } | null> => {
    try {
      const data =
        await client.withoutUnresolvableLinks.getEntries<TypeAboutUsSkeleton>({
          content_type: "aboutUs",
          select: [
            "fields.title1",
            "fields.description1",
            "fields.image1",
            "fields.title2",
            "fields.description2",
            "fields.image2",
          ],
          include: 1,
        });

      if (!data.items.length) return null;

      const aboutUs = data.items[0].fields;

      return {
        title1: aboutUs.title1,
        description1: aboutUs.description1,
        image1: aboutUs.image1?.fields?.file?.url
          ? `https:${aboutUs.image1.fields.file.url}`
          : null,
        title2: aboutUs.title2,
        description2: aboutUs.description2,
        image2: aboutUs.image2?.fields?.file?.url
          ? `https:${aboutUs.image2.fields.file.url}`
          : null,
      };
    } catch (error) {
      console.error("Error fetching About Us content:", error);
      return null;
    }
  },
  ["aboutUs"],
  { revalidate: HOUR, tags: ["aboutUs"] }
);

export async function getQuizzesByQuery(query: string) {
  try {
    const data = await db
      .select({
        id: quizzes.id,
        title: quizzes.title,
        slug: quizzes.slug,
        heroImageUrl: quizzes.heroImageUrl,
        category: sql<{
          name: string;
        }>`COALESCE(${categories.name}, 'Unknown')`,
        rating: sql<number>`COALESCE(AVG(${ratings.value}), 0)`,
      })
      .from(quizzes)
      .leftJoin(categories, eq(quizzes.categoryId, categories.id))
      .leftJoin(ratings, eq(quizzes.id, ratings.quizId))
      .where(
        sql`LOWER(${quizzes.title}) ILIKE LOWER('%' || ${query}::text || '%')`
      )
      .groupBy(quizzes.id, categories.name);

    return data;
  } catch (error) {
    console.error(`Error fetching quizzes with query "${query}":`, error);
    throw new Error("An error occurred while fetching quizzes.");
  }
}

export async function getCategoriesByQuery(query: string) {
  try {
    const data = await db
      .select({
        id: categories.id,
        name: categories.name,
        color: categories.color,
        imageUrl: categories.imageUrl,
      })
      .from(categories)
      .where(
        sql`LOWER(${categories.name}) ILIKE LOWER('%' || ${query}::text || '%')`
      );

    return data;
  } catch (error) {
    console.error(`Error fetching categories with query "${query}":`, error);
    throw new Error("An error occurred while fetching categories.");
  }
}

export const getBlogPosts = async (
  limit = 5,
  skip = 0
): Promise<{
  posts: Entry<TypeBlogSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>[];
  total: number;
}> => {
  try {
    const data =
      await client.withoutUnresolvableLinks.getEntries<TypeBlogSkeleton>({
        content_type: "blog",
        limit,
        skip,
        order: ["-sys.createdAt"],
        include: 1,
      });

    return {
      posts: data.items,
      total: data.total,
    };
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return {
      posts: [],
      total: 0,
    };
  }
};

export async function getBlogById(
  id: string
): Promise<Entry<
  TypeBlogSkeleton,
  "WITHOUT_UNRESOLVABLE_LINKS",
  string
> | null> {
  try {
    const entry =
      await client.withoutUnresolvableLinks.getEntry<TypeBlogSkeleton>(id, {
        include: 1,
      });
    return entry ?? null;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    return null;
  }
}
