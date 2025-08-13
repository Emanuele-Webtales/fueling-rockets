"use client";
import { useEffect, useState } from "react";
import Ajv from "ajv";
import schema from "@/../schemas/lesson.schema.json" assert { type: "json" };

export default function AuthorPreviewPage({ searchParams }: { searchParams?: Record<string, string> }) {
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [valid, setValid] = useState<boolean | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const slug = searchParams?.slug || 'algebra-integers-ops';
        const res = await fetch(`/content/${slug}/lesson.json`);
        const json = await res.json();
        setData(json);
        const ajv = new Ajv({ allErrors: true });
        const validate = ajv.compile(schema as any);
        const ok = validate(json);
        setValid(Boolean(ok));
        if (!ok && validate.errors) {
          setError(JSON.stringify(validate.errors, null, 2));
        }
      } catch (e: any) {
        setError(e.message);
      }
    }
    load();
  }, [searchParams]);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Author Preview</h1>
      <p className="mt-2 text-sm opacity-80">Provide <code>?slug=your-lesson-slug</code> to preview any lesson folder under <code>content/</code>.</p>
      {valid === true && (
        <p className="mt-3 rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900">
          JSON is valid.
        </p>
      )}
      {valid === false && (
        <pre className="mt-3 whitespace-pre-wrap rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
{error}
        </pre>
      )}
      <pre className="mt-6 overflow-auto rounded-md border border-black/10 bg-black p-4 text-xs text-white dark:border-white/15">
{JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}


