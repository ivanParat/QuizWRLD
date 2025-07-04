import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getBlogById } from "@/app/lib/api";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

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
          className="inline-flex items-center text-gray-600 sm:hover:text-gray-900 transition-colors duration-200 mt-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to all posts
        </Link>
      </main>
    );
  }

  const options = {
    preserveWhitespace: true,
  };
  const { title, text } = post.fields;
  const imageUrl = post.fields.image?.fields?.file?.url
    ? `https:${post.fields.image.fields.file.url}`
    : null;

  return (
    <main className="flex min-h-screen flex-col items-center p-10 px-4 pb-20 bg-off-white">
      <article className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden p-6">
        <Link
          href="/blog"
          className="inline-flex items-center text-gray-600 sm:hover:over-gray-900 transition-colors duration-200 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to all posts
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
          {title}
        </h1>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="mb-7 mt-5 max-h-96 w-full object-cover rounded"
          />
        )}
        <div className="space-y-6 text-main-text">
          {documentToReactComponents(text, options)}
        </div>
      </article>
    </main>
  );
}
