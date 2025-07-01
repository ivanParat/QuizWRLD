ALTER TABLE "ratings" DROP CONSTRAINT "ratings_quiz_id_pk";--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_user_id_quiz_id_pk" PRIMARY KEY("user_id","quiz_id");