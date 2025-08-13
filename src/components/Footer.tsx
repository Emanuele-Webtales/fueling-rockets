import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 py-8 text-sm opacity-80 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p>
          © {new Date().getFullYear()} Fueling Rockets. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link href="/" className="hover:underline">
            Terms
          </Link>
          <Link href="/" className="hover:underline">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}


