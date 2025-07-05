"use client"

import { useState, useEffect } from "react";
import Star from "./star";
import { authClient } from "@/app/lib/auth-client";
import { saveRatingToCookies, deleteRatingFromCookies, readRatingFromCookies } from "../lib/cookiesClient";

export default function Stars({ avgRating, isMobile, quizId }: { avgRating: number, isMobile: boolean, quizId: string }) {
  const { data: session } = authClient.useSession();
  const [hovered, setHovered] = useState<number | null>(null);
  const [clicked, setClicked] = useState<number | null>(null);

  useEffect(() => {
    const rating = readRatingFromCookies(quizId);
    setClicked(rating);
  }, [quizId, session]);

  function handleMouseEnter(i: number){
    if(session){
      setHovered(i);
    }
  }

  function handleMouseLeave(){
    if(session){
      setHovered(null);
    }
  }
  
  function handleMouseDown(i: number){
    if(session){
      if(clicked === i){ 
        setClicked(null);
        deleteRatingFromCookies(quizId);
      }
      else {
        setClicked(i);
        saveRatingToCookies(quizId, i);
      }
    }
  }

  function handleMouseUp(){
    if(session){
      setHovered(null);
    }
  }

  return (
    <div className="flex items-end">
      <span className="flex">
        {[1, 2, 3, 4, 5].map((i) => {
          const isFull =
            i <= Math.floor(avgRating) ||
            (i === Math.floor(avgRating) + 1 && avgRating % 1 >= 0.75);
          const isHalf =
            i === Math.floor(avgRating) + 1 && avgRating % 1 >= 0.25;
          const filled = isFull ? "yes" : isHalf ? "half" : "no";
          const isActive = (hovered !== null && clicked !== null) ? (hovered !== null && i <= hovered) : (hovered !== null && i <= hovered) || (clicked !== null && i <= clicked);

          return (
            <span
              key={i}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={() => handleMouseLeave()}
              onMouseDown={() => handleMouseDown(i)}
              onMouseUp={() => handleMouseUp()}
              onClick={e => {if(session){
                  e.stopPropagation();
                  e.preventDefault();
                }
              }}
            >
              <Star isActive={isActive} filled={filled} isMobile={isMobile} />
            </span>
          );
        })}
      </span>
      <span className="hidden  md:block text-[11px] md:text-[13px] ml-1.5 font-medium">
        {isNaN(Number(avgRating)) ||
        avgRating === null ||
        avgRating === undefined
          ? "0.0"
          : (parseFloat(avgRating.toString()) || 0).toFixed(1)}
      </span>
    </div>
  );
}