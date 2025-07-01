"use client";

import { useEffect, useState } from "react";
import { InferSelectModel } from "drizzle-orm";
import { quizzes } from "../../db/schema";
import Link from "next/link";
import Image from "next/image";
import DeleteQuizModal from "../_components/DeleteQuizModal";

type Quiz = InferSelectModel<typeof quizzes>;
type QuizCard = Pick<
  Quiz,
  "id" | "title" | "slug" | "heroImageUrl" | "published" | "description"
> & {
  rating: number;
  category: string;
  created_at: Date;
};

export default function SavedAndDraftsPage() {
  const [quizzes, setQuizzes] = useState<QuizCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quizToDelete, setQuizToDelete] = useState<QuizCard | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("/api/quizzes/get-user-drafts", {
          method: "GET",
        });

        const result = await response.json();
        console.log(result.quizzes);
        if (response.ok) {
          setQuizzes(result.quizzes);
        } else {
          setError("Failed to fetch user quizzes: " + result.error);
        }
      } catch (error) {
        setError("Failed to fetch user quizzes: " + error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleDelete = async () => {
    if (!quizToDelete) return;

    try {
      const res = await fetch(
        `/api/quizzes/delete-user-quiz?id=${quizToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete");

      setQuizzes((prev) => prev.filter((q) => q.id !== quizToDelete.id));
      setQuizToDelete(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete quiz.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-10">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
        Saved and Drafts
      </h1>

      {loading && (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {!loading && quizzes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600 mb-4">
            You don't have any drafts.
          </p>
          <Link
            href="/my-quizzes/create-a-quiz"
            className="inline-block bg-brand hover:bg-brand-hover text-white font-bold py-2 px-4 rounded"
          >
            Create Your Quizzes
          </Link>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white"
            >
              {quiz.heroImageUrl && (
                <div className="relative h-48 w-full">
                  <Image
                    src={quiz.heroImageUrl}
                    alt={quiz.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold truncate">{quiz.title}</h2>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      quiz.published
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {quiz.published ? "Published" : "Draft"}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {quiz.description || "No description"}
                </p>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{new Date(quiz.created_at).toLocaleDateString()}</span>
                  <button
                    onClick={() => setQuizToDelete(quiz)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <DeleteQuizModal
        quizTitle={quizToDelete?.title || ""}
        onConfirm={handleDelete}
        onCancel={() => setQuizToDelete(null)}
        open={!!quizToDelete}
      />
    </main>
  );
}
