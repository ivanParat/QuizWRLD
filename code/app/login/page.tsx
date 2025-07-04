"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "../lib/auth-client";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authClient.signIn.email(
        { email, password },
        {
          onRequest: () => {},
          onSuccess: async () => {
            const session = await authClient.getSession();
            const userId = session?.data?.user?.id;
            if (userId) {
              await fetch("/api/ratings/fromDb", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
              });
            }

            const redirectTo = searchParams.get("redirectTo");
            const decodedRedirectTo = redirectTo
              ? decodeURIComponent(redirectTo)
              : "/";

            if (decodedRedirectTo.includes("/login")) {
              router.push("/");
            } else {
              router.push(decodedRedirectTo);
            }
          },
          onError: (ctx) => {
            setErrorMessage(ctx.error.message);
          },
        }
      );
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-1 justify-center bg-off-white py-32 md:py-24 px-10 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center sm:text-3xl text-2xl font-bold">
          Log In to Your Account
        </h2>
        <form
          className="space-y-3 bg-background-form px-4 py-6 md:px-8 md:py-8 rounded-md drop-shadow-md"
          onSubmit={login}
        >
          <div>
            <div className="text-lg">Email</div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-2 sm:px-3 py-2 mb-3 border rounded-md bg-off-white drop-shadow-sm"
              required
            />
            <div className="text-lg">Password</div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-2 sm:px-3 py-2 mb-3 border rounded-md bg-off-white drop-shadow-sm"
              required
            />
          </div>
          {errorMessage && (
            <div className="text-red-500 text-sm">{errorMessage}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-brand text-white px-7 py-1.5 rounded-md sm:hover:bg-brand-hover sm:active:bg-brand-hover font-bold drop-shadow-sm"
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
          <div className="text-secondary-text text-base">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-brand">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
