#!/usr/bin/env node
/**
 * Create a new meeting-notes file from the template.
 *   npm run note                → today's date
 *   npm run note -- 2026-09-10  → specific date
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const arg = process.argv[2];
const date = arg ? new Date(`${arg}T12:00:00`) : new Date();
if (Number.isNaN(date.getTime())) {
  console.error('Date must look like YYYY-MM-DD');
  process.exit(1);
}
const iso = date.toISOString().slice(0, 10);
const long = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
const out = resolve('src/content/notes', `${iso}.md`);
if (existsSync(out)) {
  console.error(`Already exists: ${out}`);
  process.exit(1);
}
const tpl = readFileSync(resolve('templates/note-template.md'), 'utf8')
  .replaceAll('{{DATE}}', iso)
  .replaceAll('{{DATE_LONG}}', long);
writeFileSync(out, tpl);
console.log(`Created ${out}\nFill it in, set draft: false, then commit & push.`);
