import { cookies } from 'next/headers';
import { getRatingsByUserId } from "./api";
import { db } from "../db/drizzle";
import { ratings } from "../db/schema";
import { eq, and, inArray } from "drizzle-orm";

export async function readRatingFromCookies(): Promise<Record<string, number>> { 
  const cookieStore = await cookies();
  const cookieRaw = cookieStore.get("quizRatings")?.value;
  if (!cookieRaw) return {};
  try {
    const data = JSON.parse(cookieRaw);
    return data.ratings || {};
  } catch {
    return {};
  }
}

export async function saveRatingToCookies(ratingsObj: Record<string, number>) { 
  const cookieStore = await cookies();
  cookieStore.set("quizRatings", JSON.stringify({ ratings: ratingsObj }), {
    maxAge: 60 * 60 * 24 * 30, 
    path: "/",
  });
}

export async function syncRatingsFromDbToCookies(userId: string) {
  try {
    const ratingsFromDb = await getRatingsByUserId(userId);

    const ratings: Record<string, number> = {};
    for (const r of ratingsFromDb) {
      if(r.quizId){
        ratings[r.quizId] = r.value;
      }
    }
    console.log(ratings)
    saveRatingToCookies(ratings);
  } catch (error) {
    console.error("Failed to sync ratings from DB to cookies:", error);
  }
}

export async function syncRatingsCookieToDb(userId: string, cookieRatings: Record<string, number>) {
  // 1. Get ratings from DB
  const dbRatingsArr = await getRatingsByUserId(userId);
  const dbRatings: Record<string, number> = {};
  for (const r of dbRatingsArr) {
    if(r.quizId){
      dbRatings[r.quizId] = r.value;
    }
  }

  // 2. Compute differences
  const toInsert: { quizId: string; userId: string; value: number }[] = [];
  const toUpdate: { quizId: string; value: number }[] = [];
  const toDelete: string[] = [];

  // Find inserts and updates
  for (const quizId in cookieRatings) {
    if (!(quizId in dbRatings)) {
      toInsert.push({ quizId, userId, value: cookieRatings[quizId] });
    } else if (dbRatings[quizId] !== cookieRatings[quizId]) {
      toUpdate.push({ quizId, value: cookieRatings[quizId] });
    }
  }

  // Find deletes
  for (const quizId in dbRatings) {
    if (!(quizId in cookieRatings)) {
      toDelete.push(quizId);
    }
  }

  // 3. Perform DB operations in a transaction
  await db.transaction(async (trx) => {
    // Insert new ratings
    if (toInsert.length) {
      await trx.insert(ratings).values(toInsert);
    }
    // Update changed ratings
    for (const { quizId, value } of toUpdate) {
      await trx
        .update(ratings)
        .set({ value })
        .where(and(eq(ratings.userId, userId), eq(ratings.quizId, quizId)));
    }
    // Delete removed ratings
    if (toDelete.length) {
      await trx
        .delete(ratings)
        .where(
          and(
            eq(ratings.userId, userId),
            // Only delete ratings for the specified quizIds
            inArray(ratings.quizId, toDelete)
          )
        );
    }
  });
}