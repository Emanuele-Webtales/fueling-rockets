export default function Home() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 py-20 text-center md:py-28">
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          Learn smarter. Launch faster.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base opacity-80 sm:text-lg">
          Fueling Rockets is a mobile‑first learning platform blending engaging
          interactives with proven cognitive science. Built to support teachers
          and lift every student.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href="/login"
            className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:bg-black/85 dark:bg-white dark:text-black dark:hover:bg-white/85"
          >
            Start learning
          </a>
          <a
            href="#features"
            className="rounded-full border border-black/10 px-5 py-3 text-sm font-medium hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
          >
            See features
          </a>
        </div>
      </section>
      <section id="features" className="border-t border-black/10 bg-black/[.02] py-16 dark:border-white/10 dark:bg-white/[.03]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 md:grid-cols-3">
          <div className="rounded-lg border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-black">
            <h3 className="text-lg font-semibold">Interactive lessons</h3>
            <p className="mt-1 text-sm opacity-80">Animations and hands-on activities plus Notebook Gates for deeper learning.</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-black">
            <h3 className="text-lg font-semibold">Research-backed</h3>
            <p className="mt-1 text-sm opacity-80">Designed with Make it Stick principles—retrieval, generation, and reflection.</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-6 dark:border-white/10 dark:bg黑">
            <h3 className="text-lg font-semibold">Built for classrooms</h3>
            <p className="mt-1 text-sm opacity-80">Teacher dashboards for assignments and progress—simple and fast.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
