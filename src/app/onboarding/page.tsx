"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function OnboardingPage() {
  const supabase = getSupabaseClient();
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if already onboarded
    supabase.auth.getUser().then(async ({ data }) => {
      const id = data.user?.id;
      if (!id) return router.replace("/login");
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, onboarded")
        .eq("id", id)
        .maybeSingle();
      if (!profile) return router.replace("/signup");
      if (profile.onboarded) return router.replace("/app");
    });
  }, [router, supabase]);

  async function submit() {
    setError(null);
    const { data: auth } = await supabase.auth.getUser();
    const id = auth.user?.id;
    if (!id) {
      router.replace("/login");
      return;
    }
    if (role === "teacher") {
      const expected = process.env.NEXT_PUBLIC_TEACHER_ACCESS_CODE;
      if (!expected || code.trim() !== expected) {
        setError("Invalid teacher access code.");
        return;
      }
    }
    const { error: upsertErr } = await supabase
      .from("profiles")
      .upsert({ id, display_name: name, role, onboarded: true }, { onConflict: "id" });
    if (upsertErr) {
      setError(upsertErr.message);
      return;
    }
    router.replace("/app");
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold">Welcome</h1>
      <p className="mt-2 text-sm opacity-80">Tell us who you are to finish setting up your account.</p>

      <div className="mt-6 grid gap-3">
        <label className="text-sm">Display name</label>
        <input
          className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-1 ring-transparent focus:ring-black/10 dark:border-white/15 dark:bg-black dark:focus:ring-white/20"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
        <fieldset className="mt-3 grid grid-cols-2 gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" checked={role === "student"} onChange={() => setRole("student")} /> Student
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" checked={role === "teacher"} onChange={() => setRole("teacher")} /> Teacher
          </label>
        </fieldset>
        {role === "teacher" && (
          <div className="mt-2">
            <label className="text-sm">Teacher access code</label>
            <input
              className="mt-1 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-1 ring-transparent focus:ring-black/10 dark:border-white/15 dark:bg-black dark:focus:ring-white/20"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
            />
          </div>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button
          onClick={submit}
          disabled={!name}
          className="mt-4 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/85 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/85"
        >
          Continue
        </button>
      </div>
    </main>
  );
}


