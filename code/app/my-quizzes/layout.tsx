import { Metadata } from "next";
import { Navigation } from "./_components/navigation";

export const metadata: Metadata = {
  title: "My Quizzes",
};

export default function MyQuizzesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen pt-8 bg-off-white pb-12 p-4 md:p-10">
      <Navigation />
      {children}
    </section>
  );
}
