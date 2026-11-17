"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setDone(false);
    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.session) {
        router.push("/app");
        router.refresh();
      } else {
        setDone(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
          Create your account
        </h1>

        <p className="muted mt-2 mb-7">
          Set up your personal study space.
        </p>

        <label className="label">Student name</label>

        <input
          className="input mt-2 mb-4 w-full"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="label">Email</label>

        <input
          className="input mt-2 mb-4 w-full"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="label">
          Password (minimum 8 characters)
        </label>

        <input
          className="input mt-2 mb-5 w-full"
          type="password"
          minLength={8}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-300 text-sm mb-3">
            {error}
          </p>
        )}

        {done && (
          <p className="text-emerald-300 text-sm mb-3">
            Check your email to confirm your account, then log in.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn w-full disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="text-sm text-slate-400 mt-6">
          Already registered?{" "}
          <Link className="text-violet-300" href="/login">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
          }
