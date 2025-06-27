"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Page = {
  title: string;
  path: `/${string}`;
};

const pages: Page[] = [
  {
    title: "Create a Quiz",
    path: "/my-quizzes/create-a-quiz",
  },
  {
    title: "Analytics and Feedback",
    path: "/my-quizzes/analytics",
  },
  {
    title: "Saved and Draft Quizzes",
    path: "/my-quizzes/saved-and-drafts",
  },
];

function processPage(page: Page, index: number, pathname: string) {
  return (
    <li key={index}>
      <Link
        href={page.path}
        className={`
          text-lg
          ${pathname === page.path ? "font-semibold" : "hover:font-semibold active:font-semibold"}
        `}
      >
        {page.title}
      </Link>
    </li>
  );
}

export function Navigation() {
  const pathname = usePathname();
  return (
    <ul className="flex justify-center space-x-4">
      {pages.map((page, index) => processPage(page, index, pathname))}
    </ul>
  );
}
