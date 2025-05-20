"use client";

import { authClient } from "@/app/lib/auth-client";
import { Navigation } from "./components/navigation";
import { Suspense } from "react";
export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = authClient.useSession();

  const user = session
    ? { name: session.user.name, profilePicture: session.user.image ?? null }
    : null;

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Navigation user={user} />
      </Suspense>
      {children}
    </>
  );
}
