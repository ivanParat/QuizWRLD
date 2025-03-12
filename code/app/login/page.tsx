"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authClient.signIn.email(
        { email, password },
        {
          onRequest: () => {},
          onSuccess: () => {
            router.replace("/");
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
    <div className="flex flex-1 items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 ">
        <h2 className="text-center sm:text-3xl text-2xl font-extrabold text-gray-900">
          Log In to Your Account
        </h2>
        <form
          className="space-y-1 bg-background-form px-10 py-10 rounded-xl"
          onSubmit={login}
        >
          <div className="sm:text-base text-sm">Email</div>
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:px-3 sm:py-2 px-2 py-1 sm:mb-3 mb-6 border rounded-md"
              required
            />
            <div className="sm:text-base text-sm">Password</div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full sm:px-3 sm:py-2 px-2 py-1 sm:mb-3 mb-6 border rounded-md"
              required
            />
          </div>
          {errorMessage && (
            <div className="text-red-500 text-sm">{errorMessage}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-32 sm:py-2 sm:px-4 py-2 px-1 !mb-3 bg-brand text-white rounded-md hover:bg-light"
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
          <div className="text-secondary-text sm:text-base text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="text-brand">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
