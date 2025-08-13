import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lesson',
};

export default function LessonPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Lesson: {slug}</h1>
      <p className="mt-2 text-sm opacity-80">Lesson player placeholder.</p>
    </main>
  );
}


