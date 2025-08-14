"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getSupabaseClient } from "@/lib/supabaseClient";

const AuthStatus = dynamic(() => import("@/components/AuthStatus"), { ssr: false });

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseClient();
    let mounted = true;

    async function checkAuth() {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!mounted) return;
      
      if (user) {
        setIsAuthenticated(true);
        // Check if user is onboarded
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", user.id)
          .single();
        if (mounted) {
          setIsOnboarded(Boolean(profile?.display_name));
        }
      } else {
        setIsAuthenticated(false);
        setIsOnboarded(false);
      }
    }

    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-white/10 dark:bg-black/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-semibold">
            Fueling Rockets
          </Link>
        </div>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/" className="opacity-80 hover:opacity-100">
            Home
          </Link>
          <Link href="/author/preview" className="opacity-80 hover:opacity-100">
            Preview
          </Link>
          <Link href="/app" className="opacity-80 hover:opacity-100">
            App
          </Link>
          {!isAuthenticated && (
            <Link href="/signup" className="opacity-80 hover:opacity-100">
              Sign Up
            </Link>
          )}
          <AuthStatus />
        </nav>
        <button
          aria-label="Toggle menu"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="h-5 w-6">
            <div className="my-[3px] h-0.5 w-6 bg-current" />
            <div className="my-[3px] h-0.5 w-6 bg-current" />
            <div className="my-[3px] h-0.5 w-6 bg-current" />
          </div>
        </button>
      </div>
      {open && (
        <div className="border-t border-black/10 bg-white px-4 py-2 text-sm dark:border-white/10 dark:bg-black md:hidden">
          <div className="flex flex-col gap-2">
            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link href="/author/preview" onClick={() => setOpen(false)}>
              Preview
            </Link>
            <Link href="/app" onClick={() => setOpen(false)}>
              App
            </Link>
            {!isAuthenticated && (
              <Link href="/signup" onClick={() => setOpen(false)}>
                Sign Up
              </Link>
            )}
            <AuthStatus />
          </div>
        </div>
      )}
    </header>
  );
}


