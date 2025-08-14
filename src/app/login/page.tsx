"use client";
import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import Link from "next/link";

export default function LoginPage() {
  const supabase = getSupabaseClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  async function signIn() {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setMessage(error.message);
      setIsError(true);
    } else {
      // After successful auth, ensure a profile row exists
      const { data: u } = await supabase.auth.getUser();
      const userId = u.user?.id;
      if (userId) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", userId)
          .maybeSingle();

        if (!profile) {
          await supabase.auth.signOut();
          window.location.href = `/signup?email=${encodeURIComponent(email)}`;
          return;
        }

        if (profile.display_name) {
          window.location.href = "/app";
        } else {
          window.location.href = "/onboarding";
        }
      } else {
        window.location.href = "/login";
      }
      setIsError(false);
    }
    setLoading(false);
  }

  async function signInWithMagicLink() {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/onboarding`,
      },
    });
    if (error) {
      setMessage(error.message);
      setIsError(true);
    } else {
      setMessage("Magic link sent to your email.");
      setIsError(false);
    }
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold">Sign In</h1>
      <p className="mt-2 text-sm opacity-80">
        Sign in to your existing account.
      </p>

      <div className="mt-6 grid gap-3">
        <label className="text-sm">Email</label>
        <input
          className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-1 ring-transparent focus:ring-black/10 dark:border-white/15 dark:bg-black dark:focus:ring-white/20"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
        />
        <label className="text-sm">Password</label>
        <input
          className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-1 ring-transparent focus:ring-black/10 dark:border-white/15 dark:bg-black dark:focus:ring-white/20"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        {message && (
          <p className={`text-sm ${isError ? "text-red-600" : "text-green-600"}`}>
            {message}
          </p>
        )}
        <button
          onClick={signIn}
          disabled={loading || !email || !password}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/85 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/85"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <button
          onClick={signInWithMagicLink}
          disabled={loading || !email}
          className="rounded-md border border-black/10 bg-white px-4 py-2 text-sm font-medium hover:bg-black/5 disabled:opacity-60 dark:border-white/15 dark:bg-black dark:hover:bg-white/5"
        >
          {loading ? "Sending..." : "Send Magic Link"}
        </button>
      </div>

      <div className="mt-6 text-center text-sm">
        <p className="opacity-80">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </main>
  );
}


