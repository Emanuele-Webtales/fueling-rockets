"use client";
import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function signInWithEmail() {
    setLoading(true);
    setMessage(null);
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else setMessage("Logged in.");
    setLoading(false);
  }

  async function sendMagicLink() {
    setLoading(true);
    setMessage(null);
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setMessage(error.message);
    else setMessage("Magic link sent to your email.");
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="mt-2 text-sm opacity-80">Use email/password or request a magic link.</p>

      <div className="mt-6 grid gap-3">
        <label className="text-sm">Email</label>
        <input
          type="email"
          className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-1 ring-transparent focus:ring-black/10 dark:border-white/15 dark:bg-black dark:focus:ring-white/20"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <label className="mt-3 text-sm">Password</label>
        <input
          type="password"
          className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-1 ring-transparent focus:ring-black/10 dark:border-white/15 dark:bg-black dark:focus:ring-white/20"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        <div className="mt-4 flex gap-2">
          <button
            onClick={signInWithEmail}
            disabled={loading}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/85 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/85"
          >
            Log in
          </button>
          <button
            onClick={sendMagicLink}
            disabled={loading || !email}
            className="rounded-md border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 disabled:opacity-60 dark:border-white/15 dark:hover:bg-white/10"
          >
            Send magic link
          </button>
        </div>
        {message && <p className="mt-3 text-sm opacity-80">{message}</p>}
      </div>
    </main>
  );
}


