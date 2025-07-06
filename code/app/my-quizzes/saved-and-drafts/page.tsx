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

  const togglePublish = async (quizId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/quizzes/publish-user-quiz?id=${quizId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (!res.ok) throw new Error("Failed to toggle publish status");

      setQuizzes((prev) =>
        prev.map((quiz) =>
          quiz.id === quizId ? { ...quiz, published: !currentStatus } : quiz
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to toggle publish status.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center pt-8">
      {loading && (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 mt-2 sm:mt-0">
          {error}
        </div>
      )}

      {!loading && quizzes.length === 0 ? (
        <div className="text-center py-10 mt-24 sm:mt-0">
          <p className="text-xl text-gray-600 mb-4">
            You don&apos;t have any drafts.
          </p>
          <Link
            href="/my-quizzes/create-a-quiz"
            className="inline-block bg-brand sm:hover:bg-brand-hover text-white font-bold py-2 px-4 rounded-md drop-shadow-sm"
          >
            Create Your Quizzes
          </Link>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className={`border rounded-lg overflow-hidden shadow-md sm:hover:shadow-lg transition-shadow ${
                quiz.published
                  ? "bg-white sm:hover:bg-green-100"
                  : "bg-white sm:hover:bg-yellow-100 cursor-default"
              }`}
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
                  <button
                    onClick={() => togglePublish(quiz.id, !!quiz.published)}
                    className={`px-2 py-1 text-xs rounded-full sm:hover:underline ${
                      quiz.published
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {quiz.published ? "Unpublish" : "Publish"}
                  </button>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {quiz.description || "No description"}
                </p>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{new Date(quiz.created_at).toLocaleDateString()}</span>

                  <div className="flex justify-between items-center mb-2"></div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setQuizToDelete(quiz)}
                      className="bg-red-100 text-red-800 sm:hover:underline px-2 py-1 text-xs rounded-full"
                    >
                      Delete
                    </button>
                  </div>
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
