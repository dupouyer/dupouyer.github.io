import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    pubDate: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    description: z.string().optional(),
    categories: z.union([z.string(), z.array(z.string())]).default([]),
    tags: z.union([z.string(), z.array(z.string())]).default([]),
  }).transform(data => ({
    title: data.title,
    pubDate: data.pubDate || data.date || new Date(),
    updated: data.updated,
    description: data.description,
    categories: Array.isArray(data.categories) ? data.categories : (data.categories ? [data.categories] : []),
    tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
  })),
});

export const collections = { blog };
