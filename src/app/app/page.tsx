export default function AppHomePage() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <section className="rounded-lg border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-black">
          <h2 className="font-medium">Student</h2>
          <ul className="mt-2 list-disc pl-5 text-sm opacity-80">
            <li>Assigned lessons</li>
            <li>Points and streak</li>
          </ul>
        </section>
        <section className="rounded-lg border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-black">
          <h2 className="font-medium">Teacher</h2>
          <ul className="mt-2 list-disc pl-5 text-sm opacity-80">
            <li>Create class & join code</li>
            <li>Assign lesson</li>
            <li>Progress snapshot</li>
          </ul>
        </section>
      </div>
    </main>
  );
}


