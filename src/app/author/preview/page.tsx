import Ajv, { type ErrorObject } from "ajv";
import schema from "@/../schemas/lesson.schema.json" assert { type: "json" };
import type { Lesson } from "@/types/content";
import { headers } from 'next/headers';

export default async function AuthorPreviewPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const slug = sp?.slug || 'algebra-integers-ops';
  const hdrs = await headers();
  const host = hdrs.get('host');
  const protocol = process.env.VERCEL ? 'https' : 'http';
  const base = host ? `${protocol}://${host}` : '';
  const res = await fetch(`${base}/api/content?slug=${slug}`, { cache: 'no-store' });
  const json = (await res.json()) as Lesson;

  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema as unknown as Record<string, unknown>);
  const ok = validate(json);
  const errors = ok ? null : JSON.stringify(validate.errors as ErrorObject[] | null, null, 2);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Author Preview</h1>
      <p className="mt-2 text-sm opacity-80">Provide <code>?slug=your-lesson-slug</code> to preview any lesson folder under <code>content/</code>.</p>
      {ok ? (
        <p className="mt-3 rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900">JSON is valid.</p>
      ) : (
        <pre className="mt-3 whitespace-pre-wrap rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">{errors}</pre>
      )}
      <pre className="mt-6 overflow-auto rounded-md border border-black/10 bg-black p-4 text-xs text-white dark:border-white/15">{JSON.stringify(json, null, 2)}</pre>
    </main>
  );
}


