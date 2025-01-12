"use client";

import Link from "next/link";
import Logo from "./logo";
import { cn } from "../lib/utils";
import { useState, useRef } from "react";
import { useClickOutside } from "../hooks/useClickOutside";

type Page = {
  title: string;
  path: `/${string}`;
};

const pages: Page[] = [
  { title: "Home", path: "/" },
  {
    title: "Discover Quizzes",
    path: "/discover-quizzes",
  },
  {
    title: "My Quizzes",
    path: "/my-quizzes",
  },
  {
    title: "About us",
    path: "/about",
  },
  {
    title: "Blog",
    path: "/blog",
  }, 
  {
    title: "Sign in",
    path: "/login",
  },
];

function processPage(page: Page, index: number,  onClick?: () => void) {
  return (
    <li key={index}>
      {page.path === "/login" ? (
        <Link
          href={page.path}
          onClick={onClick}
          className="font-bold md:ml-1 lg:ml-3 xl:ml-5"
        >
          <button className="bg-brand text-white px-5 py-1 rounded-md hover:bg-brand-hover active:bg-brand-hover">
            {page.title}
          </button>
        </Link>
      ) : (
        <Link
          href={page.path}
          onClick={onClick}
          className="font-bold hover:text-brand active:text-brand px-5 py-1 md:px-1 lg:px-3 xl:px-5"
        >
          {page.title}
        </Link>
      )}
    </li>
  );
}

function SearchBar(){
  return (
    <div className="hidden md:flex items-center bg-off-white rounded-lg px-2 py-1 md:w-32 lg:w-60 xl:w-80">
      <input
        type="text"
        placeholder="Search..."
        className="w-full px-2 outline-none text-main-text bg-off-white"
      />
      <button className="ml-2 text-main-text hover:text-brand">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  )
}

type SearchIconProps = {
  closeMenu: () => void;
};

function SearchIcon({ closeMenu }: SearchIconProps){
  return (
    <button className="md:hidden ml-2 text-black hover:text-brand" onClick={closeMenu}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    </button>
  )
}

type HamburgerProps = {
  isOpen: boolean;
  toggleMenu: () => void;
};

function Hamburger({ isOpen, toggleMenu }: HamburgerProps) {
  return (
    <button
      className="flex md:hidden flex-col justify-center items-end w-11 h-11 p-2 space-y-1.5 rounded-sm  hover:bg-off-white active:bg-off-white"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      onClick={toggleMenu}
    >
      <span
        className={cn(
          "w-7 h-1 bg-black rounded-full transition-all duration-300 ease-in-out",
          { "rotate-45 translate-y-2.5": isOpen }
        )}
      />
      <span
        className={cn(
          "w-4 h-1 bg-black rounded-full transition-all duration-300 ease-in-out",
          { "opacity-0": isOpen }
        )}
      />
      <span
        className={cn(
          "w-6 h-1 bg-black rounded-full transition-all duration-300 ease-in-out",
          { "w-7 -rotate-45 -translate-y-2.5": isOpen }
        )}
      />
    </button>
  );
}

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useClickOutside(navRef, closeMenu);

  return (
    <nav 
      className="flex h-14 items-center justify-between px-2 md:px-4 lg:px-8 xl:px-12 relative"
      ref={navRef}
    >
      <Link href="/" onClick={closeMenu}>
        <Logo/>
      </Link>

      {/* Hidden on mobile */}
      <SearchBar/>
      <ul className="hidden md:flex justify-center items-center">
        {pages.map((page, index) => processPage(page, index))}
      </ul>

      {/* Visible on mobile */}
      <div className="flex md:hidden space-x-2">
        <SearchIcon closeMenu={closeMenu}/>
        <Hamburger isOpen={isMenuOpen} toggleMenu={toggleMenu} />
      </div>
      <ul
        className={cn(
          "flex md:hidden flex-col absolute top-full left-0 items-center w-full bg-off-white py-6 space-y-6 text-sm text-black",
          { hidden: !isMenuOpen }
        )}
      >
        {pages.map((page, index) =>
          processPage(page, index, closeMenu)
        )}
      </ul>
    </nav>
  );
}