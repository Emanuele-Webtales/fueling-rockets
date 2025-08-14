import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-20 text-center md:py-28">
        <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-6xl">
          Ignite Curiosity. Accelerate Learning.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base opacity-80 sm:text-lg">
          The scientifically‑backed learning platform that makes every student excel – faster
          and happier than with traditional methods.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/login"
            className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:bg-black/85 dark:bg-white dark:text-black dark:hover:bg-white/85"
          >
            Start Free Trial
          </Link>
          <a
            href="#how"
            className="rounded-full border border-black/10 px-5 py-3 text-sm font-medium hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
          >
            See How It Works
          </a>
        </div>
        <p className="mt-4 text-xs opacity-60">Backed by educators & scientists</p>
      </section>

      {/* Problem */}
      <section className="border-t border-black/10 bg-black/[.02] py-16 dark:border-white/10 dark:bg-white/[.03]">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-semibold">The Problem</h2>
          <p className="mt-3 max-w-3xl text-sm opacity-80">
            Textbooks are outdated. Classrooms are overcrowded. Kids lose focus and forget what they learn.
          </p>
          <ul className="mt-6 grid list-disc gap-2 pl-5 text-sm opacity-80 md:grid-cols-2">
            <li>Passive content leads to shallow understanding</li>
            <li>No built‑in reinforcement → forgetting curve wins</li>
            <li>Little connection between online work and real notebooks</li>
            <li>Teachers lack time and easy tools to track progress</li>
          </ul>
        </div>
      </section>

      {/* Solution */}
      <section id="how" className="py-16">
        <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 md:grid-cols-2">
          <div className="rounded-lg border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-black">
            <h2 className="text-2xl font-semibold">Fueling Rockets is the answer</h2>
            <p className="mt-3 text-sm opacity-80">
              We turn proven cognitive science into daily learning adventures. Students interact, retrieve,
              reflect, and apply — so they remember more, enjoy more, and achieve more.
            </p>
            <ul className="mt-4 list-disc pl-5 text-sm opacity-80">
              <li>Make It Stick principles: retrieval, generation, spacing, reflection</li>
              <li>Notebook Gates that connect on‑screen tasks with pen‑and‑paper thinking</li>
              <li>Teacher‑friendly assignments and instant progress snapshots</li>
            </ul>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-6 text-center dark:border-white/10 dark:bg-black">
            <div className="aspect-video w-full rounded-md border border-dashed border-black/20 dark:border-white/20" />
            <p className="mt-3 text-xs opacity-70">Product demo (coming soon)</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-black/10 bg-black/[.02] py-16 dark:border-white/10 dark:bg-white/[.03]">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-semibold">Features</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                title: "Interactive Science‑Backed Lessons",
                desc: "Engaging activities and animations grounded in the best research.",
              },
              {
                title: "Spaced Repetition Built In",
                desc: "Forget forgetting — revisit at the right time for durable learning.",
              },
              {
                title: "Gamified Learning Challenges",
                desc: "Points, achievements, and streaks keep motivation high.",
              },
              {
                title: "Offline Engagement Prompts",
                desc: "Notebook Gates reinforce real‑world practice, not just screens.",
              },
              {
                title: "Teacher & Parent Dashboards",
                desc: "Track progress and target help in seconds, not hours.",
              },
              {
                title: "Global Classroom Competitions",
                desc: "Friendly rivalry that turns learning into a sport.",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-lg border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-black">
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm opacity-80">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-semibold">Loved by learners, trusted by educators</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <blockquote className="rounded-lg border border-black/10 bg-white p-6 text-sm italic dark:border-white/10 dark:bg-black">
              “My son went from hating math to finishing lessons ahead of time — and teaching me shortcuts!”
              <div className="mt-3 not-italic opacity-70">— Sarah L., Parent</div>
            </blockquote>
            <blockquote className="rounded-lg border border-black/10 bg-white p-6 text-sm italic dark:border-white/10 dark:bg-black">
              “Finally a tool that blends classroom practice with real cognition. It just sticks.”
              <div className="mt-3 not-italic opacity-70">— Luca B., Teacher</div>
            </blockquote>
            <blockquote className="rounded-lg border border-black/10 bg-white p-6 text-sm italic dark:border-white/10 dark:bg-black">
              “I actually want to do the lessons. The challenges are addictive.”
              <div className="mt-3 not-italic opacity-70">— Giulia, Student</div>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-black/10 bg-black/[.02] py-16 text-center dark:border-white/10 dark:bg-white/[.03]">
        <h2 className="text-2xl font-semibold">Ready to Fuel the Future?</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm opacity-80">No credit card required.</p>
        <div className="mt-6">
          <Link
            href="/login"
            className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:bg-black/85 dark:bg-white dark:text-black dark:hover:bg-white/85"
          >
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-sm opacity-70">
        <div className="mx-auto max-w-6xl px-4">
          <nav className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/" className="hover:opacity-100 opacity-80">About</Link>
            <a href="#features" className="hover:opacity-100 opacity-80">Features</a>
            <Link href="/login" className="hover:opacity-100 opacity-80">Get Started</Link>
            <Link href="/login" className="hover:opacity-100 opacity-80">Privacy</Link>
            <Link href="/login" className="hover:opacity-100 opacity-80">Terms</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
