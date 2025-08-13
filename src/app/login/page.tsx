"use client";
import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const hasSupabaseEnv = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

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

  async function signUp() {
    setLoading(true);
    setMessage(null);
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage("Signed up. Check your email to confirm.");
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold">{isSignUp ? "Create account" : "Sign in"}</h1>
      <p className="mt-2 text-sm opacity-80">Use email/password or request a magic link.</p>
      {!hasSupabaseEnv && (
        <p className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Environment variables missing. Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and
          <code className="ml-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in your .env file.
        </p>
      )}

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
        <div className="mt-4 flex flex-wrap gap-2">
          {isSignUp ? (
            <button
              onClick={signUp}
              disabled={loading || !hasSupabaseEnv}
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/85 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/85"
            >
              Create account
            </button>
          ) : (
            <button
              onClick={signInWithEmail}
              disabled={loading || !hasSupabaseEnv}
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/85 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/85"
            >
              Log in
            </button>
          )}
          <button
            onClick={sendMagicLink}
            disabled={loading || !email || !hasSupabaseEnv}
            className="rounded-md border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 disabled:opacity-60 dark:border-white/15 dark:hover:bg-white/10"
          >
            Send magic link
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp((v) => !v)}
            className="ml-auto text-sm underline opacity-80 hover:opacity-100"
          >
            {isSignUp ? "Have an account? Sign in" : "New here? Create account"}
          </button>
        </div>
        {message && <p className="mt-3 text-sm opacity-80">{message}</p>}
      </div>
    </main>
  );
}


