import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getBlogById } from "@/app/lib/api";

export const metadata: Metadata = {
  title: "Blog Post",
};

type BlogPostProps = {
  params: { id: string };
};

export default async function BlogPost({ params }: BlogPostProps) {
  const { id } = await params;
  const post = await getBlogById(id);

  if (!post) {
    return (
      <main className="flex min-h-screen flex-col items-center p-10">
        <p className="text-red-600">Post not found.</p>
        <Link
          href="/blog"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mt-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to all posts
        </Link>
      </main>
    );
  }

  const { title, text } = post.fields;

  const imageUrl = post.fields.image?.fields?.file?.url
    ? `https:${post.fields.image.fields.file.url}`
    : null;

  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      <article className="w-full max-w-2xl bg-white shadow-lg rounded-lg overflow-hidden p-6">
        <Link
          href="/blog"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to all posts
        </Link>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
          {title}
        </h1>

        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="mb-6 max-h-96 w-full object-cover rounded"
          />
        )}

        <p className="whitespace-pre-line font-normal text-gray-700">{text}</p>
      </article>
    </main>
  );
}
