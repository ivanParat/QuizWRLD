"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";
import Link from "next/link";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authClient.signUp.email(
        { email, password, name: username },
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
      console.error("Sign up error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-1 justify-center bg-off-white py-10 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center sm:text-3xl text-2xl font-bold">
          Create your account
        </h2>
        <form
          className="space-y-3 bg-background-form px-4 py-6 md:px-8 md:py-8 rounded-md drop-shadow-md"
          onSubmit={signUp}
        >
          <div>
          <div className="text-lg">Username</div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-2 sm:px-3 py-2 mb-3 border rounded-md bg-off-white drop-shadow-sm"
              required
            />
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
            className="bg-brand text-white px-7 py-1.5 rounded-md hover:bg-brand-hover active:bg-brand-hover font-bold drop-shadow-sm"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          <div className="text-secondary-text text-base">
            Already have an account?{" "}
            <Link href="/login" className="text-brand">
              Log In
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
