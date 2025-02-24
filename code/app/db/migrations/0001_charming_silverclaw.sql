ALTER TABLE "answers" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "answers" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "answers" ALTER COLUMN "question_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "quiz_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "quizzes" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "quizzes" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "quizzes" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ratings" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ratings" ALTER COLUMN "quiz_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user_quizzes" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user_quizzes" ALTER COLUMN "quiz_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;