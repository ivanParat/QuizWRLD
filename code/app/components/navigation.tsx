"use client";

import Link from "next/link";
import Logo from "./logo";
import { cn } from "../lib/utils";
import { useState, useRef, useEffect } from "react";
import { useClickOutside } from "../hooks/useClickOutside";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Cookies from "js-cookie";
import { authClient } from "../lib/auth-client";
import { NavigationItem } from "../content-types";

type User = {
  id: string | null;
  name: string | null;
  profilePicture: string | null;
} | null;

function processPage(
  page: NavigationItem,
  index: number,
  onClick?: () => void
) {
  return (
    <li key={index}>
      {page.fields.path === "/login" ? (
        <Link
          href={page.fields.path}
          onClick={onClick}
          className="font-bold md:ml-1 lg:ml-3 xl:ml-5"
        >
          <button className="bg-brand text-white px-6 py-1 rounded-md sm:hover:bg-brand-hover sm:active:bg-brand-hover">
            {page.fields.title}
          </button>
        </Link>
      ) : (
        <Link
          href={page.fields.path}
          onClick={onClick}
          className="font-bold sm:hover:text-brand sm:active:text-brand px-5 py-1 md:px-1 lg:px-3 xl:px-5"
        >
          {page.fields.title}
        </Link>
      )}
    </li>
  );
}

type SearchBarProps = {
  closeMenu: () => void;
};

function SearchBar({ closeMenu }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [input, setInput] = useState(searchParams.get("q") || "");
  const handleSearch = () => {
    if (!input.trim()) return;
    router.push(`/search?q=${encodeURIComponent(input)}`);
  };

  useEffect(() => {
    if (!searchParams.get("q")) {
      setInput("");
    }
  }, [searchParams]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      {/* Hidden on mobile */}
      <div className="hidden md:flex items-center bg-off-white rounded-lg px-2 py-1 md:w-32 lg:w-60 xl:w-80">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-2 outline-none text-main-text bg-off-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          className="ml-2 text-main-text sm:hover:text-brand"
          onClick={handleSearch}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Visible on mobile */}
      <div className="md:hidden flex justify-center pl-3">
        {isSearchOpen ? (
          <div className="flex items-center bg-off-white rounded-lg px-2 w-full">
            <button
              onClick={() => {
                setIsSearchOpen(false);
                closeMenu();
              }}
              className="ml-2 text-black sm:hover:text-brand"
            >
              ✖️
            </button>
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-2 outline-none text-main-text bg-off-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              className="ml-2 text-black sm:hover:text-brand"
              onClick={() => {
                setIsSearchOpen(false);
                closeMenu();
                handleSearch();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </div>
        ) : (
          <button
            className="ml-2 text-black sm:hover:text-brand"
            onClick={() => {
              setIsSearchOpen(true);
              closeMenu();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        )}
      </div>
    </>
  );
}

type HamburgerProps = {
  isOpen: boolean;
  toggleMenu: () => void;
};

function Hamburger({ isOpen, toggleMenu }: HamburgerProps) {
  return (
    <button
      className="flex md:hidden flex-col justify-center items-end w-11 h-11 p-2 space-y-1.5 rounded-sm  sm:hover:bg-off-white sm:active:bg-off-white"
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

function ProfilePicture({
  user,
  onClick,
}: {
  user: User;
  onClick: () => void;
}) {
  if (user)
    return (
      <li className="flex items-center gap-2 min-w-8">
        <Image
          src={user.profilePicture ?? "/images/default-profile-picture.svg"}
          alt={user.name ?? "User"}
          width={300}
          height={300}
          className="w-8 h-8 rounded-full object-cover cursor-pointer"
          onClick={onClick}
          priority={true}
        />
      </li>
    );
  return null;
}

function ProfileDropdown({
  user,
  open,
  closeMenu,
}: {
  user: User;
  open: boolean;
  closeMenu: () => void;
}) {
  if (user)
    return (
      <ul
        className={cn(
          "flex flex-col absolute top-full right-3 items-center min-w-1/2 md:min-w-auto bg-white px-12 py-6 space-y-6 text-sm md:text-md text-black z-50 drop-shadow-sm",
          { hidden: !open }
        )}
      >
        <li key="username" className="font-bold">
          User: {user?.name}
        </li>
        <li key="profile">
          <Link
            href="/profile-settings"
            className="font-bold sm:hover:text-brand sm:active:text-brand"
            onClick={closeMenu}
          >
            Profile
          </Link>
        </li>
        <li
          key="logout"
          onClick={() => {
            closeMenu();
            handleLogout(user.id);
          }}
          className="font-bold sm:hover:text-brand sm:active:text-brand cursor-pointer"
        >
          Log Out
        </li>
      </ul>
    );
}

const handleLogout = async (userId: string | null) => {
  if (userId)
    try {
      type RatingsCookie = {
        ratings: Record<string, number>;
      };
      const cookieRaw = Cookies.get("quizRatings");
      const cookieRatings: RatingsCookie | null = cookieRaw
        ? JSON.parse(cookieRaw)
        : null;
      if (
        userId &&
        cookieRatings &&
        Object.keys(cookieRatings.ratings).length > 0
      )
        await fetch("/api/ratings/toDb", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId,
            ratings: cookieRatings.ratings,
          }),
        });

      await authClient.signOut();
    } catch (error) {
      console.error("Error logging out:", error);
    }
};

export function Navigation({
  user,
  isPending,
  pages,
}: {
  user: User;
  isPending: boolean;
  pages: NavigationItem[];
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileDropdown = () =>
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const closeProfileDropdown = () => setIsProfileDropdownOpen(false);

  useClickOutside(navRef, closeMenu);
  useClickOutside(navRef, closeProfileDropdown);

  const visiblePages = pages.filter((page) => {
    if (page.fields.path === "/login" && (user || isPending)) return false;
    return true;
  });

  return (
    <nav
      className="flex h-14 items-center justify-between px-2 md:px-4 lg:px-8 xl:px-12 relative"
      ref={navRef}
    >
      <Link
        href="/"
        onClick={() => {
          closeMenu();
          closeProfileDropdown();
        }}
      >
        <Logo />
      </Link>

      {/* Hidden on mobile */}
      <div className="hidden md:flex items-center">
        <SearchBar
          closeMenu={() => {
            closeMenu();
            closeProfileDropdown();
          }}
        />
      </div>
      <div className="hidden md:flex items-center space-x-4">
        <ul className="flex justify-center items-center">
          {visiblePages.map((page, index) =>
            processPage(page, index, closeProfileDropdown)
          )}
        </ul>
        {isPending && (
          <div className="w-8 h-8 border-[3px] border-secondary-text border-t-transparent rounded-full animate-spin" />
        )}
        {user && <ProfilePicture user={user} onClick={toggleProfileDropdown} />}
        {isProfileDropdownOpen && user && (
          <ProfileDropdown
            user={user}
            open={isProfileDropdownOpen}
            closeMenu={closeProfileDropdown}
          />
        )}
      </div>

      {/* Visible on mobile */}
      <div className="flex md:hidden space-x-2 items-center">
        <div className="flex space-x-2">
          <SearchBar
            closeMenu={() => {
              closeMenu();
              closeProfileDropdown();
            }}
          />
          <Hamburger
            isOpen={isMenuOpen}
            toggleMenu={() => {
              closeProfileDropdown();
              toggleMenu();
            }}
          />
        </div>

        <ul
          className={cn(
            "flex flex-col absolute top-full right-3 items-center min-w-1/2 md:min-w-auto bg-white px-12 py-6 space-y-6 text-sm md:text-md text-black z-50 drop-shadow-sm",
            { hidden: !isMenuOpen }
          )}
        >
          {visiblePages.map((page, index) =>
            processPage(page, index, closeMenu)
          )}
        </ul>

        {isPending && (
          <div className="w-8 h-8 border-[3px] border-secondary-text border-t-transparent rounded-full animate-spin" />
        )}
        {user && (
          <ProfilePicture
            user={user}
            onClick={() => {
              closeMenu();
              toggleProfileDropdown();
            }}
          />
        )}
        {isProfileDropdownOpen && user && (
          <ProfileDropdown
            user={user}
            open={isProfileDropdownOpen}
            closeMenu={closeProfileDropdown}
          />
        )}
      </div>
    </nav>
  );
}
