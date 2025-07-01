"use client"

import { useState, useEffect } from "react";
import Star from "./star";
import { authClient } from "@/app/lib/auth-client";
import { saveRatingToCookies, deleteRatingFromCookies, readRatingFromCookies } from "../lib/cookiesClient";
import useIsMobile from "../hooks/useIsMobile";

export default function StarsEndOfQuiz({ quizId }: { quizId: string }) {
  const { data: session } = authClient.useSession();
  const [hovered, setHovered] = useState<number | null>(null);
  const [clicked, setClicked] = useState<number | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const rating = readRatingFromCookies(quizId);
    setClicked(rating);
  }, [quizId]);

  function handleMouseEnter(i: number){
    if(session){
      setHovered(i);
    }
  }

  function handleMouseLeave(i: number){
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

  function handleMouseUp(i: number){
    if(session){
      setHovered(null);
    }
  }

  return (
    <div className="flex">
      <span className="flex cursor-pointer">
        {[1, 2, 3, 4, 5].map((i) => {
          const isActive = (hovered !== null && clicked !== null) ? (hovered !== null && i <= hovered) : (hovered !== null && i <= hovered) || (clicked !== null && i <= clicked);

          return (
            <span
              key={i}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={() => handleMouseLeave(i)}
              onMouseDown={() => handleMouseDown(i)}
              onMouseUp={() => handleMouseUp(i)}
              onClick={e => {if(session){
                  e.stopPropagation();
                  e.preventDefault();
                }
              }}
            >
              <Star isActive={isActive} filled={"no"} isMobile={isMobile} endOfQuiz={true}/>
            </span>
          );
        })}
      </span>
    </div>
  );
}