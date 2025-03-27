import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import supabase from "@/app/lib/supabase";
import { z } from "zod";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_FILE_SIZE = 5000000;

const quizSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.string().min(1),
  published: z.boolean(),
  questions: z
    .array(
      z.object({
        title: z.string().min(1),
        answers: z
          .array(
            z.object({
              text: z.string().min(1),
              isCorrect: z.boolean(),
            })
          )
          .min(2),
      })
    )
    .min(1),
  image: z
    .any()
    .nullable()
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      `Max image size is 5MB.`
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const rawData = {
      title: formData.get("title"),
      description: formData.get("description"),
      categoryId: formData.get("categoryId"),
      published: formData.get("published") === "true",
      questions: JSON.parse(formData.get("questions") as string),
      image: formData.get("image"),
    };
    console.log(rawData);

    const validation = quizSchema.safeParse(rawData);
    console.log(validation.error);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.errors },
        { status: 400 }
      );
    }
    console.log(validation);

    const { title, description, categoryId, questions, published } =
      validation.data;

    const slug = generateSlug(title);
    const quizId = `quiz_${uuidv4()}`;

    let imageUrl = null;
    const imageFile = formData.get("image") as File | null;

    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("quiz-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error("Image upload failed:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }

      imageUrl = uploadData.path;
    }

    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .insert({
        id: quizId,
        user_id: session.user.id,
        title: title,
        slug: slug,
        description: description,
        hero_image_url: imageUrl,
        category_id: categoryId,
        published,
      })
      .select("id")
      .single();

    if (quizError || !quiz) {
      console.error("Quiz creation failed:", quizError);
      return NextResponse.json(
        { error: "Failed to create quiz" },
        { status: 500 }
      );
    }

    for (const question of questions) {
      const questionId = `question_${uuidv4()}`;
      const { data: q, error: qError } = await supabase
        .from("questions")
        .insert({
          id: questionId,
          quiz_id: quiz.id,
          title: question.title,
        })
        .select("id")
        .single();

      if (qError || !q) {
        console.error("Question creation failed:", qError);
        await supabase.from("quizzes").delete().eq("id", quiz.id);
        return NextResponse.json(
          { error: "Failed to create questions" },
          { status: 500 }
        );
      }

      for (const answer of question.answers) {
        const answerId = `answer_${uuidv4()}`;
        const { error: aError } = await supabase.from("answers").insert({
          id: answerId,
          question_id: q.id,
          text: answer.text,
          is_correct: answer.isCorrect,
        });

        if (aError) {
          console.error("Answer creation failed:", aError);
          await supabase.from("quizzes").delete().eq("id", quiz.id);
          return NextResponse.json(
            { error: "Failed to create answers" },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json(
      { success: true, quizId: quiz.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Quiz submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
