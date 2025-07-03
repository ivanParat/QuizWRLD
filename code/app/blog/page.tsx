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

  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<BlogEntry[]>([]);

  useEffect(() => {
    const savedPosts = sessionStorage.getItem("blogPosts");
    const savedSkip = sessionStorage.getItem("blogSkip");
    const savedTotal = sessionStorage.getItem("blogTotal");

    if (savedPosts && savedSkip && savedTotal) {
      setPosts(JSON.parse(savedPosts));
      setSkip(Number(savedSkip));
      setTotal(Number(savedTotal));
    } else {
      loadMore();
    }
  }, []);
  useEffect(() => {
    if (posts.length > 0) {
      sessionStorage.setItem("blogPosts", JSON.stringify(posts));
      sessionStorage.setItem("blogSkip", skip.toString());
      sessionStorage.setItem("blogTotal", total.toString());
    }
  }, [posts, skip, total]);

  const loadMore = async () => {
    if (loading) return;

    setLoading(true);

    const { posts: newPosts, total: newTotal } = await getBlogPosts(
      PAGE_SIZE,
      skip
    );

    setPosts((prev) => {
      const existingIds = new Set(prev.map((p) => p.sys.id));
      const uniqueNewPosts = newPosts.filter((p) => !existingIds.has(p.sys.id));
      return [...prev, ...uniqueNewPosts];
    });

    setSkip((prev) => prev + PAGE_SIZE);
    setTotal(newTotal);
    setLoading(false);
  };

  const hasMore = skip < total;

  return (
    <main className="flex min-h-screen flex-col items-center p-10 bg-off-white">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
        Blog
      </h1>

      <ul className="w-full max-w-2xl space-y-4 mb-6">
        {posts.map((post) => (
          <li key={post.sys.id} className="mb-4">
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

      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="px-6 py-2 bg-brand text-white font-semibold rounded-lg hover:bg-brand-hover transition-colors drop-shadow-sm"
        >
          {loading ? "Loading..." : "Show More"}
        </button>
      )}
    </main>
  );
}
