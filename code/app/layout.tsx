import type { Metadata } from "next";
import localFont from "next/font/local";
import { Roboto } from "next/font/google";
import "./globals.css";
import Footer from "./components/footer";
import ClientRootLayout from "./ClientRootLayout";
import { getMainNavigation } from "./lib/api";
import { NavigationItem } from "./content-types";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    template: "%s | QuizWRLD",
    default: "QuizWRLD",
  },
  description: "Create or solve fun and challenging quizzes instantly.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pages: NavigationItem[] = await getMainNavigation();

  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${geistSans.variable} ${geistMono.variable} antialiased space-y-0`}
      >
        <ClientRootLayout pages={pages}>{children}</ClientRootLayout>
        <Footer />
      </body>
    </html>
  );
}
