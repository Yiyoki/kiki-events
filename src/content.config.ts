import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const events = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    deck: z.string(),
    eventDate: z.coerce.date(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    region: z.string().optional(),
    severity: z.string().optional(),
    author: z.string().default('KiKi喵'),
    draft: z.boolean().default(true),
    sources: z.array(z.object({
      title: z.string(),
      url: z.string().url(),
      outlet: z.string().optional(),
    })).default([]),
  }),
});

export const collections = { events };
