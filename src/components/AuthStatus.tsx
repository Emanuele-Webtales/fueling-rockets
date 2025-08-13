"use client";
import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthStatus() {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const supabase = getSupabaseClient();
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setEmail(data.session?.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!email) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-black px-4 py-2 text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
      >
        Log in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="hidden opacity-80 sm:inline">{email}</span>
      <button
        onClick={async () => {
          const supabase = getSupabaseClient();
          await supabase.auth.signOut();
          router.push("/");
        }}
        className="rounded-full border border-black/10 px-3 py-1.5 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
      >
        Log out
      </button>
    </div>
  );
}


