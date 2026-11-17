"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const router = useRouter();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setBusy(true);
    setError("");

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push("/app");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function forgotPassword() {
    if (!email) {
      setError("Enter your email first.");
      return;
    }

    setError("");

    try {
      const supabase = createClient();

      const { error } =
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

      if (error) {
        setError(error.message);
      } else {
        setError("Password reset email sent successfully!");
      }
    } catch {
      setError("Unable to send reset email. Please try again.");
    }
  }

  return (
    <main className="min-h-screen grid-bg flex items-center justify-center p-5">
      <form
        onSubmit={submit}
        className="glass card w-full max-w-md"
      >
        <Link
          href="/"
          className="brand font-bold gradient-text"
        >
          ASHU STUDY HELPER
        </Link>

        <h1 className="text-3xl font-bold mt-8">
          Welcome back
        </h1>

        <p className="muted mt-2 mb-7">
          Sign in to continue your study journey.
        </p>

        <label className="label">
          Email
        </label>

        <input
          className="input mt-2 mb-4"
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="label">
          Password
        </label>

        <input
          className="input mt-2 mb-5"
          type="password"
          placeholder="Enter your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-300 text-sm mb-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="btn w-full"
          disabled={busy}
        >
          {busy ? "Signing in..." : "Login"}
        </button>

        <button
          type="button"
          onClick={forgotPassword}
          className="text-xs text-cyan-300 mt-4"
        >
          Forgot password?
        </button>

        <p className="text-sm text-slate-400 mt-6">
          New here?{" "}
          <Link
            className="text-violet-300"
            href="/signup"
          >
            Create account
          </Link>
        </p>
      </form>
    </main>
  );
}
