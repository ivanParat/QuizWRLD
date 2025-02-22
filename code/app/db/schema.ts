import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
  uuid,
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").unique().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").unique().notNull(),
  color: text("color"),
  imageUrl: text("image_url"),
});

export const quizzes = pgTable("quizzes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  heroImageUrl: text("hero_image_url"),
  categoryId: integer("category_id").references(() => categories.id),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  quizId: uuid("quiz_id").references(() => quizzes.id),
  title: text("title").notNull(),
  order: integer("order").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const answers = pgTable("answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  questionId: uuid("question_id").references(() => questions.id),
  text: text("text").notNull(),
  isCorrect: boolean("is_correct").notNull().default(false),
  explanation: text("explanation"),
  order: integer("order").notNull().default(1),
});

export const ratings = pgTable("ratings", {
  userId: uuid("user_id").references(() => users.id),
  quizId: uuid("quiz_id").references(() => quizzes.id),
  value: integer("value").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  primaryKey: text("primary_key")
    .notNull()
    .default("PRIMARY KEY (user_id, quiz_id)"),
});

export const userQuizzes = pgTable("user_quizzes", {
  userId: uuid("user_id").references(() => users.id),
  quizId: uuid("quiz_id").references(() => quizzes.id),
  primaryKey: text("primary_key")
    .notNull()
    .default("PRIMARY KEY (user_id, quiz_id)"),
});
