"use client";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import supabase from "@/app/lib/supabase";
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
  } = useForm<FormData>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
  const [published, setPublished] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) {
        console.error("Error fetching categories", error.message);
      } else {
        setCategories(data || []);
      }
    };
    fetchCategories();
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

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
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
        alert("Quiz saved successfully!");
      } else {
        console.error("Error creating quiz:", result.error);
        alert("Failed to create quiz: " + result.error);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Create New Quiz</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-8 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Quiz Details</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title*</label>
            <input
              {...register("title", { required: "Title is required" })}
              className="w-full p-2 border rounded"
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
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Category*</label>
            <select
              {...register("category.id", { required: "Category is required" })}
              className="w-full p-2 border rounded"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Quiz Image</label>
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="mb-8 p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Q{index + 1}
                </button>
              ))}
            </div>
          )}

          {currentQuestionIndex >= 0 &&
            currentQuestionIndex < questions.length && (
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">
                    Question {currentQuestionIndex + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeQuestion(currentQuestionIndex)}
                    className="text-red-500 text-sm"
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
                    className="w-full p-2 border rounded"
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
                          className="flex-1 p-2 border rounded mr-2"
                          placeholder="Answer text"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeAnswer(currentQuestionIndex, aIndex)
                          }
                          className="text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    )
                  )}
                  <button
                    type="button"
                    onClick={() => addAnswer(currentQuestionIndex)}
                    className="text-blue-500 text-sm mt-2"
                  >
                    + Add Answer
                  </button>
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    disabled={currentQuestionIndex === 0}
                    onClick={() =>
                      setCurrentQuestionIndex(currentQuestionIndex - 1)
                    }
                    className={`px-3 py-1 rounded ${
                      currentQuestionIndex === 0
                        ? "bg-gray-200 text-gray-500"
                        : "bg-gray-200 hover:bg-gray-300"
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
                    className={`px-3 py-1 rounded ${
                      currentQuestionIndex === questions.length - 1
                        ? "bg-gray-200 text-gray-500"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    Next Question
                  </button>
                </div>
              </div>
            )}
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => {
              if (confirm("Are you sure you want to exit without saving?")) {
              }
            }}
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
          >
            Exit Without Saving
          </button>
          <div className="space-x-3">
            <button
              type="submit"
              onClick={() => setPublished(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Save to Drafts
            </button>
            <button
              type="submit"
              onClick={() => setPublished(true)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Publish Quiz
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
