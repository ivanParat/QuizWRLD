"use client";

import { authClient } from "@/app/lib/auth-client";
import { Navigation } from "./components/navigation";
import { Suspense } from "react";
import ReviewSyncTracker from "./components/reviewSyncTracker";

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();

  const user = session
    ? { id: session.user.id, name: session.user.name, profilePicture: session.user.image ?? null }
    : null;

  return (
    <>
      <ReviewSyncTracker/>
      <Suspense fallback={<div>Loading...</div>}>
        <Navigation user={user} isPending={isPending} />
      </Suspense>
      {children}
    </>
  );
}
