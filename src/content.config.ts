import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    meta_description: z.string().max(160).optional(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    author: z.string(),
    category: z.string(),
    image: image().optional(),
    draft: z.boolean().optional().default(false),
    readingTime: z.string().optional(),
  }),
});

const jobs = defineCollection({
  loader: glob({ base: './src/content/jobs', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    company: z.string(),
    description: z.string(),
    type: z.enum(['Remoto', 'Freelance', 'Fixo', 'Híbrido']),
    pubDate: z.coerce.date(),
    salary: z.string(),
    active: z.boolean().optional().default(true),
    link: z.string().optional(),
  }),
});

export const collections = { blog, jobs };
