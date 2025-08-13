import { type Metadata } from 'next';
import { headers } from 'next/headers';
import type { Lesson, Section, MCQSection, ShortAnswerSection, NotebookGateSection, InteractiveExploreSection } from '@/types/content';

export const metadata: Metadata = { title: 'Lesson' };

async function fetchLesson(slug: string): Promise<Lesson | null> {
  const hdrs = headers();
  const host = (await hdrs).get('host');
  const protocol = process.env.VERCEL ? 'https' : 'http';
  const base = host ? `${protocol}://${host}` : '';
  const res = await fetch(`${base}/api/content?slug=${slug}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    return null;
  }
  return (await res.json()) as Lesson;
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = await fetchLesson(slug);
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">{lesson?.title ?? `Lesson: ${slug}`}</h1>
      {!lesson && (
        <p className="mt-2 text-sm opacity-80">Lesson JSON not found for slug: {slug}</p>
      )}
      {lesson && (
        <LessonRenderer sections={lesson.sections ?? []} />
      )}
    </main>
  );
}

function LessonRenderer({ sections }: { sections: Section[] }) {
  return (
    <div className="mt-6 grid gap-6">
      {sections.map((section, idx) => {
        switch (section.type) {
          case 'mcq':
            return <MCQ key={idx} section={section as MCQSection} index={idx} />;
          case 'short_answer':
            return <ShortAnswer key={idx} section={section as ShortAnswerSection} index={idx} />;
          case 'notebook_gate':
            return <NotebookGate key={idx} section={section as NotebookGateSection} index={idx} />;
          case 'interactive_explore':
            return <InteractiveExplore key={idx} section={section as InteractiveExploreSection} index={idx} />;
          default:
            return (
              <div key={idx} className="rounded-lg border border-black/10 bg-white p-4 text-sm opacity-80 dark:border-white/15 dark:bg-black">
                Unknown section
              </div>
            );
        }
      })}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-black/10 bg-white p-4 dark:border-white/15 dark:bg-black">
      {children}
    </section>
  );
}

function MCQ({ section, index }: { section: MCQSection; index: number }) {
  return (
    <Card>
      <h2 className="font-medium">{index + 1}. {section.prompt}</h2>
      <ul className="mt-3 grid gap-2">
        {section.choices?.map((c, i) => (
          <li key={i} className="rounded-md border border-black/10 px-3 py-2 text-sm hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10">
            {c}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ShortAnswer({ section, index }: { section: ShortAnswerSection; index: number }) {
  return (
    <Card>
      <h2 className="font-medium">{index + 1}. {section.prompt}</h2>
      <textarea className="mt-3 w-full rounded-md border border-black/10 bg-white p-2 text-sm outline-none ring-1 ring-transparent focus:ring-black/10 dark:border-white/15 dark:bg-black dark:focus:ring-white/20" rows={3} placeholder="Type your answer..." />
    </Card>
  );
}

function NotebookGate({ section, index }: { section: NotebookGateSection; index: number }) {
  return (
    <Card>
      <h2 className="font-medium">{index + 1}. {section.prompt}</h2>
      <input className="mt-3 w-full rounded-md border border-black/10 bg-white p-2 text-sm outline-none ring-1 ring-transparent focus:ring-black/10 dark:border-white/15 dark:bg-black dark:focus:ring-white/20" placeholder={section.reflection?.placeholder ?? 'Write what you noticed...'} />
    </Card>
  );
}

function InteractiveExplore({ section, index }: { section: InteractiveExploreSection; index: number }) {
  return (
    <Card>
      <h2 className="font-medium">{index + 1}. Interactive: {section.pattern}</h2>
      <p className="mt-2 text-sm opacity-80">Placeholder for interactive pattern.</p>
    </Card>
  );
}



