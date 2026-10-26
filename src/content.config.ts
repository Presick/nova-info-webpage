import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// The reviewed Markdown files live in ../pages and are copied to ./content/pages
// by scripts/sync-content.mjs before every build.
const guides = defineCollection({
  loader: glob({ pattern: ['*.md', '!*.gate.md'], base: './content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    type: z.enum(['hub', 'state']).optional(),
    trade: z.string().optional(),
    state: z.string().optional(),
    status: z.string(),
    last_updated: z.coerce.date(),
    data_pulled: z.coerce.date().optional(),
    owner_disclosure: z.string(),
    reviewer: z.string().optional(),
    authorities: z.array(z.object({ name: z.string(), url: z.string() })).optional(),
  }),
});

export const collections = { guides };
