"use client";

import { authClient } from "@/app/lib/auth-client";
import { Navigation } from "./components/navigation";
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
      <Navigation user={user} />
      {children}
    </>
  );
}
