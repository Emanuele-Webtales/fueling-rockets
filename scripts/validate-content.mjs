#!/usr/bin/env node
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';
import Ajv from 'ajv';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const schemaPath = path.join(repoRoot, 'schemas', 'lesson.schema.json');
const contentRoot = path.join(repoRoot, 'content');

async function listLessonJsonFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const res = path.resolve(dir, entry.name);
      if (entry.isDirectory()) return listLessonJsonFiles(res);
      if (entry.isFile() && entry.name === 'lesson.json') return [res];
      return [];
    })
  );
  return files.flat();
}

async function main() {
  try {
    const schemaRaw = await readFile(schemaPath, 'utf8');
    const schema = JSON.parse(schemaRaw);
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(schema);

    const exists = await stat(contentRoot).then(() => true).catch(() => false);
    if (!exists) {
      console.log('No content directory found, skipping.');
      return;
    }

    const files = await listLessonJsonFiles(contentRoot);
    if (files.length === 0) {
      console.error('No lesson.json files found under content/.');
      process.exit(1);
    }

    let hasErrors = false;
    for (const file of files) {
      const raw = await readFile(file, 'utf8');
      const json = JSON.parse(raw);
      const ok = validate(json);
      if (!ok) {
        hasErrors = true;
        console.error(`Validation failed for ${path.relative(repoRoot, file)}:`);
        console.error(validate.errors);
      } else {
        console.log(`OK: ${path.relative(repoRoot, file)}`);
      }
    }

    if (hasErrors) process.exit(1);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

await main();


