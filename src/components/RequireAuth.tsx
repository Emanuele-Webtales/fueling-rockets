"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";

type Props = { children: React.ReactNode };

export default function RequireAuth({ children }: Props) {
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseClient();
    let mounted = true;
    async function check() {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!mounted) return;
      if (!user) {
        router.replace("/login");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, role, onboarded")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile) {
        await supabase.auth.signOut();
        router.replace(`/signup?email=${encodeURIComponent(user.email ?? "")}`);
        return;
      }

      // Gate on explicit onboarded flag
      if (!profile.onboarded) {
        router.replace("/onboarding");
        return;
      }

      setReady(true);
    }
    check();
    return () => {
      mounted = false;
    };
  }, [router]);

  if (!ready) {
    return (
      <div className="mx-auto max-w-2xl p-6 text-sm opacity-80">Loading…</div>
    );
  }

  return <>{children}</>;
}


