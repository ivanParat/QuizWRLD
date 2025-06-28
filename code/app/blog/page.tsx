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
    loadMore();
  }, []);

  const loadMore = async () => {
    setLoading(true);
    const { posts: newPosts, total } = await getBlogPosts(PAGE_SIZE, skip);
    setPosts((prev) => [...prev, ...newPosts]);
    setSkip(skip + PAGE_SIZE);
    setTotal(total);
    setLoading(false);
  };

  const hasMore = skip < total;

  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      <h1 className="text-6xl font-extrabold tracking-tight mb-10">Blog</h1>

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
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          {loading ? "Loading..." : "Show More"}
        </button>
      )}
    </main>
  );
}
