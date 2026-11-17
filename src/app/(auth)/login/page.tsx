"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setBusy(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
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
    if (!email.trim()) {
      setError("Enter your email first.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const { error } =
        await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });

      if (error) {
        setError(error.message);
      } else {
        setError("Password reset email sent. Check your inbox.");
      }
    } catch {
      setError("Unable to send reset email. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen grid-bg flex items-center justify-center p-5">
      <form
        onSubmit={submit}
        className="glass card w-full max-w-md"
      >
        <Link href="/" className="brand font-bold gradient-text">
          ASHU STUDY HELPER
        </Link>

        <h1 className="text-3xl font-bold mt-8">
          Welcome back
        </h1>

        <p className="muted mt-2 mb-7">
          Sign in to continue your study journey.
        </p>

        <label className="label">Email</label>

        <input
          className="input mt-2 mb-4 w-full"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="label">Password</label>

        <input
          className="input mt-2 mb-5 w-full"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
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
          disabled={busy}
          className="text-xs text-cyan-300 mt-4 disabled:opacity-50"
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
