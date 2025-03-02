"use client"

import { useState, useEffect, useRef } from "react";

function Question({ text }: { text: string }) {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = textRef.current;
    if (element) {
      setIsTruncated(element.scrollHeight > element.clientHeight);
    }
  }, [text]);

  return (
    <div
      ref={textRef}
      className="px-3 text-center max-h-[100px] overflow-hidden text-ellipsis line-clamp-3"
      title={isTruncated ? text : ""}
    >
      {text}
    </div>
  );
}

interface AnswerProps {
  color: string;
  text: string;
}

function Answer({ color, text }: AnswerProps) {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const element = textRef.current;
    if (element) {
      setIsTruncated(element.scrollWidth > element.clientWidth);
    }
  }, [text]);

  return (
    <button
      ref={textRef}
      style={{ backgroundColor: color }} 
      className={`hover:opacity-85 active:opacity-85 text-white py-[19px] md:py-[14px] px-[10px] rounded-md drop-shadow-sm text-left
      max-h-[65px] md:max-h-[55px] overflow-hidden text-ellipsis whitespace-nowrap`}
      title={isTruncated ? text : ""}
    >
      {text}
    </button>
  );
}


export default function QuestionCard(){
  return(
    <div className="flex flex-col bg-[#E0E6EC] rounded-md w-19/20 md:w-[644px] px-[30px] pt-[15px] drop-shadow-md">
      <div className="flex justify-between items-center mb-[15px]">
        <span className="text-main-text">
          Question 2 of 10
        </span>
        <button className="font-bold text-base bg-[#969DA5] text-white px-6 py-1 rounded-md hover:bg-[#a9b1b8] active:bg-[#a9b1b8] drop-shadow-sm">
          Quit
        </button>
      </div>
      <div className="flex justify-center items-center bg-off-white font-medium text-[20px] text-main-text h-[100px] rounded-md drop-shadow-md mb-[42px]">
        <Question text="Which city is the capital of Mongolia?"/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] md:gap-[9px] mb-[30px] text-[18px] font-medium">
        <Answer color="#D82C2C" text="Answer 1 Answer 1 Answer 1 Answer 1 Answer 1 Answer 1 Answer 1" />
        <Answer color="#3577BE" text="Answer 2" />
        <Answer color="#CDA735" text="Answer 3" />
        <Answer color="#2E9645" text="Answer 4" />
      </div>
    </div>
  );
}