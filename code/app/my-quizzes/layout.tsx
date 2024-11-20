import { Metadata } from "next";
import { Navigation } from "./_components/navigation";

export const metadata: Metadata = {
  title: "My Quizzes",
};

export default function DiscoverQuizzesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="mt-4">
      <Navigation />
      {children}
    </section>
  );
}
