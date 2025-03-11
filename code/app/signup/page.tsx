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
            alert(ctx.error.message);
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
    <div className="flex flex-1 items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center sm:text-3xl text-2xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <form
          className="space-y-1 bg-background-form px-10 py-10 rounded-xl"
          onSubmit={signUp}
        >
          <div className="sm:text-base text-sm">Username</div>
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full sm:px-3 sm:py-2 px-2 py-1 sm:mb-3 mb-6 border rounded-md"
              required
            />
            <div className="sm:text-base text-sm">Email</div>
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
          <button
            type="submit"
            disabled={loading}
            className="w-28 sm:py-2 sm:px-4 py-2 px-1 !mb-3 bg-brand text-white rounded-md hover:bg-light"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          <div className="text-secondary-text sm:text-base text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-brand">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
