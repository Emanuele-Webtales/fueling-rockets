import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Lesson } from '@/types/content';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }
  try {
    const filePath = path.join(process.cwd(), 'content', slug, 'lesson.json');
    const raw = await readFile(filePath, 'utf8');
    const json = JSON.parse(raw) as Lesson;
    return NextResponse.json(json, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Not found';
    return NextResponse.json({ error: message }, { status: 404 });
  }
}


