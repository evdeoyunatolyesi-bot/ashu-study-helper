"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Reset() {
  const [p, setP] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center p-5">
      <form
        className="glass card w-full max-w-md"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setMsg("");

          try {
            const supabase = createClient();

            const { error } = await supabase.auth.updateUser({
              password: p,
            });

            if (error) {
              setMsg(error.message);
            } else {
              setMsg("Password updated successfully!");

              setTimeout(() => {
                router.push("/app");
              }, 1000);
            }
          } catch {
            setMsg("Something went wrong. Please try again.");
          } finally {
            setLoading(false);
          }
        }}
      >
        <h1 className="text-2xl font-bold mb-5">
          Set a new password
        </h1>

        <input
          className="input mb-4"
          type="password"
          minLength={8}
          required
          value={p}
          onChange={(e) => setP(e.target.value)}
          placeholder="New password"
        />

        <button
          type="submit"
          className="btn w-full"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update password"}
        </button>

        <p className="text-sm mt-4 text-cyan-200">
          {msg}
        </p>
      </form>
    </main>
  );
}
