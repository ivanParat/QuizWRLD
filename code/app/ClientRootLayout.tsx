"use client";

import { authClient } from "@/app/lib/auth-client";
import { Navigation } from "./components/navigation";
import { Suspense } from "react";
import ReviewSyncTracker from "./components/reviewSyncTracker";
import { NavigationItem } from "./content-types";

export default function ClientRootLayout({
  children,
  pages,
}: {
  children: React.ReactNode;
  pages: NavigationItem[];
}) {
  const { data: session, isPending } = authClient.useSession();

  const user = session
    ? {
        id: session.user.id,
        name: session.user.name,
        profilePicture: session.user.image ?? null,
      }
    : null;

  return (
    <>
      <ReviewSyncTracker />
      <Suspense fallback={<div>Loading...</div>}>
        <Navigation user={user} isPending={isPending} pages={pages} />
      </Suspense>
      {children}
    </>
  );
}
