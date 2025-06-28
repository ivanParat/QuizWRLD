import { Metadata } from "next";
import { Navigation } from "./_components/navigation";

export const metadata: Metadata = {
  title: "Discover Quizzes",
};

export default function DiscoverQuizzesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="pt-8 bg-off-white">
      <Navigation />
      {children}
    </section>
  );
}
