"use client"

import { authClient } from "@/app/lib/auth-client";
import { useEffect, useRef } from "react";
import Cookies from "js-cookie";

type RatingsCookie = {
  ratings: Record<string, number>;
};

function areRatingsEqual(a: RatingsCookie | null, b: RatingsCookie | null) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export default function ReviewSyncTracker(){
  const { data: session } = authClient.useSession();
  const lastSyncedRef = useRef<RatingsCookie | null>(null);
  const hasMounted = useRef<boolean>(false);

  useEffect(() => {
    // Skip logic on first render (when session is likely loading)
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    //fires when the user logs out
    if (!session) {
      Cookies.remove("quizRatings");
      return;
    }

    const userId = session.user.id;

    const init = () => {
      const cookieRaw = Cookies.get("quizRatings");
      const cookieRatings: RatingsCookie | null = cookieRaw ? JSON.parse(cookieRaw) : null;
      lastSyncedRef.current = cookieRatings;
    };

    const syncReviewsIfNeeded = () => {
      const cookieRaw = Cookies.get("quizRatings");
      const cookieRatings: RatingsCookie | null = cookieRaw ? JSON.parse(cookieRaw) : null;
      if (!areRatingsEqual(lastSyncedRef.current, cookieRatings)) {
        console.log(userId)
        // They are different, do your sync logic here
        //lastSyncedRef.current = cookieRatings;

        // const data = { userId };
        // const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
        // navigator.sendBeacon("/api/sync-favorites/beacon", blob);
        lastSyncedRef.current = cookieRatings;
      }
    };

    init();

    const handleUnload = () => syncReviewsIfNeeded();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        syncReviewsIfNeeded();
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    const interval = setInterval(syncReviewsIfNeeded, 60000); 

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
    };
  }, [session]);

  return null;
}