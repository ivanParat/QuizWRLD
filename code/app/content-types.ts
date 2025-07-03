import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeAnswerFields {
  text: EntryFieldTypes.Symbol;
  isCorrect: EntryFieldTypes.Boolean;
  associatedQuestion: EntryFieldTypes.EntryLink<TypeQuestionSkeleton>;
}

export type TypeAnswerSkeleton = EntrySkeletonType<TypeAnswerFields, "answer">;

export type TypeAnswer<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = Entry<TypeAnswerSkeleton, Modifiers, Locales>;

export interface TypeQuestionFields {
  title: EntryFieldTypes.Symbol;
  answers: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeAnswerSkeleton>>;
  correctAnswer: EntryFieldTypes.EntryLink<TypeAnswerSkeleton>;
}

export type TypeQuestionSkeleton = EntrySkeletonType<
  TypeQuestionFields,
  "question"
>;

export type TypeQuestion<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = Entry<TypeQuestionSkeleton, Modifiers, Locales>;

export interface TypeQuizzFields {
  title: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  description: EntryFieldTypes.Text;
  heroImage: EntryFieldTypes.AssetLink;
  category: EntryFieldTypes.EntryLink<TypeCategorySkeleton>;
  questions: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeQuestionSkeleton>
  >;
  rating: EntryFieldTypes.Number;
}

export interface TypeQuizzFieldsHomePage {
  title: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  heroImage: EntryFieldTypes.AssetLink;
  category: EntryFieldTypes.EntryLink<TypeCategorySkeleton>;
  rating: EntryFieldTypes.Number;
}

export type TypeQuizzSkeleton = EntrySkeletonType<TypeQuizzFields, "quiz">;

export type TypeQuizzHomePageSkeleton = EntrySkeletonType<
  TypeQuizzFieldsHomePage,
  "quiz"
>;

export interface TypeCategoryFields {
  name: EntryFieldTypes.Symbol;
  color?: EntryFieldTypes.Symbol;
  image?: EntryFieldTypes.AssetLink;
}

export interface TypeAboutUsFields {
  title1: EntryFieldTypes.Symbol;
  description1: EntryFieldTypes.Text;
  image1: EntryFieldTypes.AssetLink;
  title2: EntryFieldTypes.Symbol;
  description2: EntryFieldTypes.Text;
  image2: EntryFieldTypes.AssetLink;
}

export type TypeCategorySkeleton = EntrySkeletonType<
  TypeCategoryFields,
  "category"
>;

export interface TypeBlogFields {
  title: EntryFieldTypes.Symbol;
  text: Document;
  image: EntryFieldTypes.AssetLink;
}

export type TypeBlogSkeleton = EntrySkeletonType<TypeBlogFields, "blog">;

export type TypeBlog<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = Entry<TypeBlogSkeleton, Modifiers, Locales>;

export type TypeCategory<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = Entry<TypeCategorySkeleton, Modifiers, Locales>;

export type TypeQuizz<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = Entry<TypeQuizzSkeleton, Modifiers, Locales>;

export type TypeQuizzHomePage<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = Entry<TypeQuizzHomePageSkeleton, Modifiers, Locales>;

export type TypeAboutUsSkeleton = EntrySkeletonType<
  TypeAboutUsFields,
  "aboutUs"
>;

export type TypeAboutUs<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = Entry<TypeAboutUsSkeleton, Modifiers, Locales>;
