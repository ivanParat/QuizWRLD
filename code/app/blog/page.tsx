"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { TypeBlogSkeleton } from "../content-types";
import { Entry } from "contentful";
import { getBlogPosts } from "../lib/api";

const PAGE_SIZE = 5;

export default function BlogPage() {
  type BlogEntry = Entry<
    TypeBlogSkeleton,
    "WITHOUT_UNRESOLVABLE_LINKS",
    string
  >;

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<BlogEntry[]>([]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  useEffect(() => {
    const savedPage = sessionStorage.getItem("blogPage");
    const savedPosts = sessionStorage.getItem("blogPosts");
    const savedTotal = sessionStorage.getItem("blogTotal");

    if (savedPosts && savedPage && savedTotal) {
      setPage(Number(savedPage));
      setPosts(JSON.parse(savedPosts));
      setTotal(Number(savedTotal));
    } else {
      fetchPosts(1);
    }
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      sessionStorage.setItem("blogPage", page.toString());
      sessionStorage.setItem("blogPosts", JSON.stringify(posts));
      sessionStorage.setItem("blogTotal", total.toString());
    }
  }, [posts, page, total]);

  const fetchPosts = async (pageNum: number) => {
    setLoading(true);
    const skip = (pageNum - 1) * PAGE_SIZE;

    const { posts: newPosts, total: newTotal } = await getBlogPosts(
      PAGE_SIZE,
      skip
    );

    setPosts(newPosts);
    setTotal(newTotal);
    setLoading(false);
  };

  const handlePageChange = (pageNum: number) => {
    if (pageNum !== page) {
      setPage(pageNum);
      fetchPosts(pageNum);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-10 bg-off-white">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
        Blog
      </h1>

      <ul className="w-full max-w-2xl space-y-4 mb-6">
        {posts.map((post) => (
          <li key={post.sys.id}>
            <Link
              href={`/blog/${post.sys.id}`}
              className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 transition-colors duration-200"
            >
              <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                {post.fields.title}
              </h2>
              <p className="font-normal text-gray-700">Click to read more...</p>
            </Link>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => handlePageChange(num)}
              disabled={loading || num === page}
              className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                num === page
                  ? "bg-brand text-white"
                  : "bg-white border-gray-300 hover:bg-gray-100"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
