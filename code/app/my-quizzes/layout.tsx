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
    <section className="min-h-screen pt-8 bg-off-white pb-12">
      <Navigation />
      {children}
    </section>
  );
}
