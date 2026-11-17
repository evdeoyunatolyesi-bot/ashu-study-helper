"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Reset() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("Password updated successfully.");

      setTimeout(() => {
        router.push("/app");
      }, 1000);

    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-5">

      <form
        className="glass card w-full max-w-md"
        onSubmit={handleSubmit}
      >

        <h1 className="text-2xl font-bold mb-5">
          Set a new password
        </h1>

        <input
          className="input mb-4"
          type="password"
          minLength={8}
          required
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
        />

        <button
          className="btn w-full"
          type="submit"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update password"}
        </button>

        {message && (
          <p
            className="text-sm mt-4 text-cyan-200"
            role="status"
          >
            {message}
          </p>
        )}

      </form>

    </main>
  );
}
