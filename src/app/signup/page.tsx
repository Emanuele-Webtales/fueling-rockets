"use client";
import { useState, useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const supabase = getSupabaseClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if already authenticated
    supabase.auth.getUser().then(async ({ data }) => {
      const id = data.user?.id;
      if (!id) return;
      const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", id).single();
      if (profile?.display_name) {
        router.replace("/app");
      } else {
        router.replace("/onboarding");
      }
    });
  }, []);

  async function signUp() {
    setLoading(true);
    setMessage(null);
    
    if (password !== confirmPassword) {
      setMessage("Passwords don't match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    // Check if email already exists by attempting to sign in
    // This is a reliable way to check if an email is registered
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: "dummy-password-to-check-existence"
    });
    
    // If we get an "Invalid login credentials" error, the email exists
    if (signInError && signInError.message.includes("Invalid login credentials")) {
      setMessage("An account with this email already exists. Please sign in instead.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/onboarding`,
      },
    });
    
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email to confirm your account, then you can sign in.");
    }
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold">Create Account</h1>
      <p className="mt-2 text-sm opacity-80">
        Sign up for a new Fueling Rockets account.
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
        <label className="text-sm">Confirm Password</label>
        <input
          className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-1 ring-transparent focus:ring-black/10 dark:border-white/15 dark:bg-black dark:focus:ring-white/20"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
        />
        {message && (
          <div className="text-sm">
            <p className={message.includes("already exists") ? "text-red-600" : message.includes("error") ? "text-red-600" : "text-green-600"}>
              {message}
            </p>
            {message.includes("already exists") && (
              <p className="mt-2 text-sm">
                <Link href="/login" className="text-blue-600 hover:underline">
                  Go to sign in page →
                </Link>
              </p>
            )}
          </div>
        )}
        <button
          onClick={signUp}
          disabled={loading || !email || !password || !confirmPassword}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/85 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/85"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </div>

      <div className="mt-6 text-center text-sm">
        <p className="opacity-80">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </main>
  );
}
