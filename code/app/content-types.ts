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
}

export type TypeAnswerSkeleton = EntrySkeletonType<TypeAnswerFields, "answer">;
export type TypeAnswer<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = Entry<TypeAnswerSkeleton, Modifiers, Locales>;

export interface TypeQuestionFields {
  title: EntryFieldTypes.Symbol;
  description?: EntryFieldTypes.Text;
  answers: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeAnswerSkeleton>>;
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
  category: EntryFieldTypes.Symbol;
  questions: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeQuestionSkeleton>
  >;
  rating: EntryFieldTypes.Number;
}

export interface TypeQuizzFieldsHomePage {
  title: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  heroImage: EntryFieldTypes.AssetLink;
  category: EntryFieldTypes.Symbol;
  rating: EntryFieldTypes.Number;
}

export type TypeQuizzSkeleton = EntrySkeletonType<TypeQuizzFields, "quiz">;
export type TypeQuizzHomePageSkeleton = EntrySkeletonType<
  TypeQuizzFieldsHomePage,
  "quiz"
>;

export type TypeQuizz<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = Entry<TypeQuizzSkeleton, Modifiers, Locales>;

export type TypeQuizzHomePage<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = Entry<TypeQuizzHomePageSkeleton, Modifiers, Locales>;
