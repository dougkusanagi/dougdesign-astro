import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    slug: z.string().optional(),
    meta_description: z.string().max(160).optional(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string(),
    category: z.string(),
    image: image().optional(),
    draft: z.boolean().optional().default(false),
    scheduled: z.boolean().optional().default(false),
    readingTime: z.string().optional(),
    featured_image: z.object({
      prompt: z.string().optional(),
      alt: z.string().optional(),
      generated_path: z.string().optional(),
    }).optional(),
    keyword_principal: z.string().optional(),
    content_type: z.string().optional(),
    cluster: z.string().optional(),
    assunto: z.string().optional(),
    intencao_busca: z.string().optional(),
    decisao_do_leitor: z.string().optional(),
    fato_novo: z.string().optional(),
    canonical_role: z.string().optional(),
    internal_links: z.object({
      to: z.array(z.string()).optional().default([]),
      from_needed: z.array(z.string()).optional().default([]),
    }).optional(),
    quality_notes: z.object({
      below_word_target_reason: z.string().nullable().optional(),
    }).optional(),
    canibalizacao: z.object({
      status: z.string().optional(),
      resumo: z.string().optional(),
    }).optional(),
    fontes_oficiais: z.array(z.string()).optional(),
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
