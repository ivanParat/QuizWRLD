"use client";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import supabase from "@/app/lib/supabase";
import CreateAQuizModal from "../_components/CreateAQuizModal";
import ExitModal from "../_components/ExitModal";
import { useRouter } from "next/navigation";

import { authClient } from "@/app/lib/auth-client";
import Link from "next/link";
import Loading from "@/app/loading";
interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  title: string;
  answers: Answer[];
}

interface FormData {
  title: string;
  description: string;
  category: Category;
  image: FileList;
}

interface Category {
  id: string;
  name: string;
}

export default function QuizForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [exit, setExit] = useState<boolean>(false);
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      const session = await authClient.getSession();

      if (!session?.data?.user) {
        setError("Please log in to create a quiz.");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.from("categories").select("*");
        if (error) {
          setError(error.message);
        } else {
          setCategories(data || []);
        }
      } catch (err) {
        setError("Unexpected error fetching categories.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const addQuestion = () => {
    const newQuestion: Question = {
      title: "",
      answers: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    };
    setQuestions([...questions, newQuestion]);
    setCurrentQuestionIndex(questions.length);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    setCurrentQuestionIndex(
      Math.min(currentQuestionIndex, updatedQuestions.length - 1)
    );
  };

  const handleAnswerChange = (
    qIndex: number,
    aIndex: number,
    field: "isCorrect" | "text",
    value: string | boolean
  ) => {
    const updatedQuestions = [...questions];

    if (field === "isCorrect") {
      updatedQuestions[qIndex].answers.forEach((a) => (a.isCorrect = false));
      updatedQuestions[qIndex].answers[aIndex][field] = value as boolean;
    } else {
      updatedQuestions[qIndex].answers[aIndex][field] = value as string;
    }

    setQuestions(updatedQuestions);
  };

  const addAnswer = (qIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].answers.push({ text: "", isCorrect: false });
    setQuestions(updatedQuestions);
  };

  const removeAnswer = (qIndex: number, aIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].answers.splice(aIndex, 1);
    setQuestions(updatedQuestions);
  };

  function onModalConfirm() {
    if (modalMessage === "Quiz created successfully") {
      window.location.reload();
    } else {
      setModalMessage(null);
    }
  }

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    setLoading(true);

    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description || "");
    formData.append("categoryId", data.category.id);
    formData.append("published", published ? "true" : "false");

    formData.append("questions", JSON.stringify(questions));

    const imageFile = data.image[0];
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch("/api/quizzes/add-quiz", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Quiz created successfully:", result);
        setModalMessage("Quiz created successfully");
      } else {
        console.error("Error creating quiz:", result.error);
        setModalMessage("Error creating quiz");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setModalMessage("An unexpected error occurred. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : error ? (
        <main className="flex min-h-screen flex-col items-center pt-8">
          <div className="text-center py-10 mt-24 sm:mt-0">
            <p className="text-xl text-gray-600 mb-4">{error}</p>
            <Link
              href="/login"
              className="inline-block bg-brand sm:hover:bg-brand-hover text-white font-bold py-1.5 px-6 rounded-md drop-shadow-sm mt-10"
            >
              Log in
            </Link>
          </div>
        </main>
      ) : (
        <div className="max-w-4xl mx-auto p-6 bg-background-form rounded-lg shadow-md mt-8">
          <h1 className="text-2xl font-bold mb-6">Create New Quiz</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Quiz Details */}
            <div className="mb-8 p-4 border border-gray-400 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Quiz Details</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Title*</label>
                <input
                  {...register("title", { required: "Title is required" })}
                  className="w-full p-2 border rounded bg-off-white"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  className="w-full p-2 border rounded bg-off-white"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Category*
                </label>
                <select
                  {...register("category.id", {
                    required: "Category is required",
                  })}
                  className="w-full p-2 border rounded bg-off-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Quiz Image
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <label
                    htmlFor="quiz-image"
                    className="inline-block px-4 py-2 bg-brand text-white cursor-pointer sm:hover:bg-brand-hover sm:active:bg-brand-hover rounded-md font-semibold drop-shadow-sm"
                  >
                    Choose Image
                  </label>
                  <input
                    id="quiz-image"
                    type="file"
                    accept="image/*"
                    {...register("image")}
                    className="hidden"
                  />
                </div>
                {/* Show selected file name */}
                {watch("image") && watch("image").length > 0 && (
                  <span className="text-sm text-main-text mt-2">
                    {watch("image")[0].name}
                  </span>
                )}
              </div>
            </div>

            {/* Questions Navigation */}
            <div className="mb-8 p-4 border border-gray-400 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Questions</h2>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="bg-brand text-white px-4 py-2 rounded-md sm:hover:bg-brand-hover font-semibold drop-shadow-sm"
                >
                  Add Question
                </button>
              </div>

              {questions.length > 0 && (
                <div className="mb-4 flex space-x-2 overflow-x-auto pb-2">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`px-3 py-1 rounded ${
                        currentQuestionIndex === index
                          ? "bg-brand text-white"
                          : "bg-gray-500 text-white sm:hover:bg-brand sm:active:bg-brand"
                      }`}
                    >
                      Q{index + 1}
                    </button>
                  ))}
                </div>
              )}

              {/* Current Question Edit */}
              {currentQuestionIndex >= 0 &&
                currentQuestionIndex < questions.length && (
                  <div className="p-4 border border-gray-400 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">
                        Question {currentQuestionIndex + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeQuestion(currentQuestionIndex)}
                        className="text-red-500 sm:hover:text-red-400 text-sm font-medium py-1.5 px-2"
                      >
                        Remove Question
                      </button>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Question Text*
                      </label>
                      <input
                        value={questions[currentQuestionIndex].title}
                        onChange={(e) => {
                          const updatedQuestions = [...questions];
                          updatedQuestions[currentQuestionIndex].title =
                            e.target.value;
                          setQuestions(updatedQuestions);
                        }}
                        className="w-full p-2 border rounded bg-off-white"
                        required
                      />
                    </div>

                    <div className="mb-2">
                      <label className="block text-sm font-medium mb-2">
                        Answers*
                      </label>
                      {questions[currentQuestionIndex].answers.map(
                        (answer, aIndex) => (
                          <div key={aIndex} className="flex items-center mb-2">
                            <input
                              type="radio"
                              name={`correctAnswer-${currentQuestionIndex}`}
                              checked={answer.isCorrect}
                              onChange={() =>
                                handleAnswerChange(
                                  currentQuestionIndex,
                                  aIndex,
                                  "isCorrect",
                                  true
                                )
                              }
                              className="mr-2"
                            />
                            <input
                              type="text"
                              value={answer.text}
                              onChange={(e) =>
                                handleAnswerChange(
                                  currentQuestionIndex,
                                  aIndex,
                                  "text",
                                  e.target.value
                                )
                              }
                              className="flex-1 p-2 border rounded mr-2 bg-off-white w-1/2 sm:w-auto"
                              placeholder="Answer text"
                              required
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeAnswer(currentQuestionIndex, aIndex)
                              }
                              className="text-red-500 sm:hover:text-red-400 text-sm font-medium px-1 py-1.5"
                            >
                              Remove
                            </button>
                          </div>
                        )
                      )}
                      <button
                        type="button"
                        onClick={() => addAnswer(currentQuestionIndex)}
                        className="text-blue-500 sm:hover:text-blue-400 text-sm mt-2 font-medium px-2 py-1.5"
                      >
                        + Add Answer
                      </button>
                    </div>

                    <div className="flex flex-col items-center sm:flex-row sm:justify-between mt-4 space-y-2 sm:space-y-0">
                      <button
                        type="button"
                        disabled={currentQuestionIndex === 0}
                        onClick={() =>
                          setCurrentQuestionIndex(currentQuestionIndex - 1)
                        }
                        className={`px-3 py-2 sm:py-1 rounded w-2/3 sm:w-auto ${
                          currentQuestionIndex === 0
                            ? "bg-gray-300 text-gray-500"
                            : "bg-gray-500 sm:hover:bg-gray-400 text-white"
                        }`}
                      >
                        Previous Question
                      </button>
                      <button
                        type="button"
                        disabled={currentQuestionIndex === questions.length - 1}
                        onClick={() =>
                          setCurrentQuestionIndex(currentQuestionIndex + 1)
                        }
                        className={`px-3 py-2 sm:py-1 rounded w-2/3 sm:w-auto ${
                          currentQuestionIndex === questions.length - 1
                            ? "bg-gray-300 text-gray-500"
                            : "bg-gray-500 sm:hover:bg-gray-400 text-white"
                        }`}
                      >
                        Next Question
                      </button>
                    </div>
                  </div>
                )}
            </div>

            {/* Form Buttons */}
            <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-2 sm:space-y-0 items-center">
              <button
                type="button"
                onClick={() => setExit(true)}
                className="px-4 py-2 bg-incorrect text-white rounded-md sm:hover:bg-incorrect-hover font-semibold drop-shadow-sm w-3/4 sm:w-auto"
              >
                Exit Without Saving
              </button>
              <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 w-full sm:w-auto items-center">
                <button
                  type="submit"
                  onClick={() => setPublished(false)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md sm:hover:bg-yellow-400 font-semibold drop-shadow-sm w-3/4 sm:w-auto"
                >
                  Save to Drafts
                </button>
                <button
                  type="submit"
                  onClick={() => setPublished(true)}
                  className="px-4 py-2 bg-correct text-white rounded-md sm:hover:bg-correct-hover font-semibold drop-shadow-sm w-3/4 sm:w-auto"
                >
                  Publish Quiz
                </button>
              </div>
            </div>
          </form>

          {/* Modals */}
          {exit && (
            <ExitModal
              onCancel={() => setExit(false)}
              onConfirm={() => router.push("/")}
            />
          )}
          {modalMessage && (
            <CreateAQuizModal
              message={modalMessage}
              onConfirm={onModalConfirm}
            />
          )}
        </div>
      )}
    </>
  );
}
