import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// Meeting notes — one markdown file per meeting in src/content/notes/YYYY-MM-DD.md
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    location: z.string().optional(),
    facilitator: z.string().optional(),
    notetaker: z.string().optional(),
    attendees: z.array(z.string()).default([]),
    summary: z.string().optional(),
    decisions: z.array(z.string()).default([]),
    actionItems: z
      .array(
        z.object({
          task: z.string(),
          owner: z.string().default('Unassigned'),
          due: z.coerce.date().optional(),
          done: z.boolean().default(false),
        }),
      )
      .default([]),
    nextMeeting: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

// Calendar events — src/content/data/events.json
const events = defineCollection({
  loader: file('./src/content/data/events.json'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
    start: z.string().regex(/^\d{2}:\d{2}$/, 'Use 24h HH:MM').optional(),
    end: z.string().regex(/^\d{2}:\d{2}$/, 'Use 24h HH:MM').optional(),
    location: z.string().optional(),
    zoom: z.string().optional(), // overrides site.zoomUrl for this meeting
    inPerson: z.boolean().default(false),
    description: z.string().optional(),
    type: z.enum(['meeting', 'deadline', 'event', 'lc']).default('meeting'),
  }),
});

// Documents & collateral — src/content/data/documents.json
const documents = defineCollection({
  loader: file('./src/content/data/documents.json'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    category: z.string().default('General'),
    url: z.string().url(),
    type: z.enum(['pdf', 'doc', 'sheet', 'slides', 'link', 'folder', 'image', 'video']).default('link'),
    updated: z.coerce.date().optional(),
    owner: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { notes, events, documents };
